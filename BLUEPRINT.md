# SlotLine — Blueprint

A simple appointment booking app. Visitors pick an open time slot and book it; the owner
sees every booking on a dashboard and can cancel one.

---

## 1. The problem & who it's for

Small service providers (tutors, barbers, coaches, small clinics) need a simple way for
clients to book a time without back-and-forth messaging. SlotLine provides a public
booking page and a private dashboard of bookings.

---

## 2. v1 scope (building now)

- Public booking page showing available time slots for the next 7 days.
- Visitor books a slot by entering name + email and selecting a slot.
- Backend re-checks the slot is free, then saves the booking.
- Owner dashboard listing all bookings, newest first (no login in v1).
- Owner can cancel a booking; a cancelled slot becomes available again.
- Deployed to a live URL (frontend, backend, and database all hosted).

## 2b. Out of scope for v1 (planned roadmap)

- Authentication on the dashboard (to be added with an auth service, not hand-rolled).
- Payments and email/SMS confirmations & reminders.
- Owner-editable availability (custom hours, days off, multiple services/staff).
- Time zones, recurring appointments, calendar (Google) sync.

Each item is deferred either because it is substantial work (payments, reminders) or
genuinely error-prone (auth, time zones). v1 delivers the core booking loop end to end.

---

## 3. Use cases / user stories

- As a visitor, I can see which time slots are open in the next 7 days.
- As a visitor, I can book an open slot with my name and email.
- As a visitor, if a slot was just taken, I am told it is no longer available.
- As the owner, I can see all bookings in one list.
- As the owner, I can cancel a booking so the freed slot can be booked again.

---

## 4. Requirements

**Functional**
- Generate bookable slots from a fixed rule: 09:00–17:00, 30-minute slots, today + next 6 days.
- A slot is "available" if no `confirmed` booking exists for that exact start time.
- Booking requires name + email + a valid, currently-available slot.
- The backend validates availability at save time (not only in the UI).
- Cancelling sets a booking's status to `cancelled` (record kept, slot reopens).

**Non-functional**
- No authentication in v1 (dashboard is open); planned for a later version.
- Basic input validation (email format; slot must be one of the generated slots).
- Runs on free-tier hosting; sized for low-traffic / demo use.

---

## 5. Data model

One table. Available slots are computed (every possible slot minus the ones already
booked), so there is no separate "slots" table.

- **Booking**
  - `id` — uuid — primary key; used to reference a specific booking when cancelling.
  - `name` — text — who booked.
  - `email` — text — contact for the booking.
  - `startTime` — datetime — the booked slot's start; the field checked for clashes.
  - `status` — text — `confirmed` or `cancelled`. Default `confirmed`.
  - `createdAt` — datetime — when the booking was made; used to sort. Default now().

Relationships: none in v1 (single table).

---

## 6. API / endpoints

All return JSON.

- `GET /api/slots`
  - Returns the computed list of slots for the next 7 days, each marked available or taken.
  - Input: none.
  - Output: `[{ startTime: ISOstring, available: boolean }, ...]`

- `POST /api/bookings`
  - Creates a booking after re-checking the slot is free.
  - Input (body): `{ name: string, email: string, startTime: ISOstring }`
  - Output (success): `{ id, name, email, startTime, status }`
  - Output (slot taken): HTTP 409 + `{ error: "Slot no longer available" }`
  - Output (bad input): HTTP 400 + `{ error: "..." }`

- `GET /api/bookings`
  - Returns all bookings, newest first.
  - Input: none.
  - Output: `[{ id, name, email, startTime, status, createdAt }, ...]`

- `PATCH /api/bookings/:id/cancel`
  - Sets a booking's status to `cancelled`.
  - Input: `id` in the URL.
  - Output: `{ id, status: "cancelled" }`

---

## 7. Screens / pages

- **Booking page** (`/`)
  - Purpose: let a visitor pick and book a slot.
  - Contains: name field, email field, a list/grid of upcoming slots (open slots
    clickable, taken slots disabled), and a confirmation message after booking.
  - Calls: `GET /api/slots` on load; `POST /api/bookings` on submit.

- **Dashboard page** (`/dashboard`)
  - Purpose: let the owner view and manage bookings.
  - Contains: a table of bookings (name, email, time, status) newest-first, with a
    "Cancel" button on confirmed rows.
  - Calls: `GET /api/bookings` on load; `PATCH /api/bookings/:id/cancel` on cancel.

---

## 8. Folder / file structure

```
slotline/
├── BLUEPRINT.md
├── PLAN.md
├── README.md
├── client/                 # React + Vite frontend (runs in the browser)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── BookingPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── api.ts          # helper functions that call the backend
│   │   └── main.tsx
│   ├── .env                # VITE_API_URL (not committed)
│   └── package.json
└── server/                 # Node + Express backend (runs on a server)
    ├── src/
    │   ├── index.ts        # starts the Express server
    │   ├── routes/
    │   │   ├── slots.ts
    │   │   └── bookings.ts
    │   └── slots.ts        # slot-generation logic (pure function)
    ├── prisma/
    │   └── schema.prisma   # the Booking table definition
    ├── .env                # DATABASE_URL, PORT (not committed)
    └── package.json
```

---

## 9. Key user flows (end to end)

**Book a slot**
1. Visitor opens `/`; frontend calls `GET /api/slots`; backend computes slots and returns them.
2. Frontend shows open slots; visitor enters name + email and selects the 2:00 PM slot.
3. Frontend sends `POST /api/bookings` with `{name, email, startTime}`.
4. Backend re-checks the DB for a confirmed booking at that startTime.
   - Free → insert row → return the booking → frontend shows confirmation.
   - Taken → return 409 → frontend shows "slot no longer available" and refreshes slots.

**Cancel a booking (owner)**
1. Owner opens `/dashboard`; frontend calls `GET /api/bookings`; backend returns all bookings.
2. Owner clicks Cancel; frontend sends `PATCH /api/bookings/:id/cancel`.
3. Backend sets status to `cancelled`; that slot now computes as available again.

---

## 10. Environment / config

Config lives in `.env` files (never committed — `.env` is gitignored).

- **server/.env**
  - `DATABASE_URL` — Postgres connection string. Secret.
  - `PORT` — local backend port (e.g. 4000).
- **client/.env**
  - `VITE_API_URL` — backend base URL (`http://localhost:4000` locally; live URL in production).

---

## 11. Tech choices + why

- **React + Vite (frontend)** — Fast, minimal React setup; a separate frontend keeps the
  frontend/backend boundary explicit.
- **Node + Express (backend)** — Minimal, well-documented HTTP layer with an explicit
  request → response cycle.
- **TypeScript everywhere** — One language end to end; static types catch errors before
  runtime and document the API shapes.
- **PostgreSQL** — Robust relational database; the relational model transfers broadly.
- **Prisma** — Type-safe database access with a readable schema file and clear migrations.
- **Hosting** — frontend → Vercel, backend → Render, Postgres → Neon (all free tier).

---

## 12. Risks / unknowns

- **Dates/times** are the fiddly part — slot generation and "is this exact time booked"
  must align. Mitigation: store/compare in UTC with fixed hours to avoid time-zone issues.
- **Free-tier backend cold start** (Render sleeps when idle) — first request after idle is
  slow; addressed at deploy time.
- **CORS** — the browser blocks cross-origin requests unless the backend allows the
  frontend's origin; configured when wiring the two together.
