# SlotLine — Plan

The execution checklist: the order we build in and where we commit. One step at a time.
We do not start a step until the previous one runs and is understood. `[ ]` = todo, `[x]` = done.

Legend: ✅ = commit point (save your progress to git here).

---

## Phase A — Setup

- [ ] **A1.** Create the `slotline/` repo locally, `git init`, add a `.gitignore` (ignore `node_modules`, `.env`).
- [ ] **A2.** Create `client/` (React + Vite + TypeScript) and confirm it runs in the browser.
- [ ] **A3.** Create `server/` (Node + Express + TypeScript) and confirm it responds to a test request.
- [ ] ✅ **commit** — *why: skeleton runs; safe baseline before adding logic.*
      `chore: scaffold client and server`

## Phase B — Data layer (the database)

- [ ] **B1.** Provision a free Postgres database on Neon; copy its connection string into `server/.env`.
- [ ] **B2.** Add Prisma to the server; write the `Booking` model in `schema.prisma`.
- [ ] **B3.** Run the first migration to create the `Booking` table; verify the table exists.
- [ ] ✅ **commit** — *why: database connected and schema created; this is a real milestone.*
      `feat: add Postgres + Prisma and create Booking table`

## Phase C — Backend (the API)

- [ ] **C1.** Write the slot-generation logic (`server/src/slots.ts`): 09:00–17:00, 30-min, 7 days.
- [ ] **C2.** Build `GET /api/slots` (returns slots + available/taken) and test it in the browser/curl.
- [ ] **C3.** Build `POST /api/bookings` with the re-check-then-save logic; test booking a slot.
- [ ] **C4.** Build `GET /api/bookings` (all bookings, newest first); test it.
- [ ] **C5.** Build `PATCH /api/bookings/:id/cancel`; test cancelling reopens the slot.
- [ ] ✅ **commit** — *why: the entire backend works end to end against the real DB.*
      `feat: booking + slots API with availability checks`

## Phase D — Frontend (the UI)

- [ ] **D1.** Add an `api.ts` helper that calls the backend; wire `VITE_API_URL` from `client/.env`.
- [ ] **D2.** Build the Booking page: load slots, show open/taken, submit a booking, show result.
- [ ] **D3.** Build the Dashboard page: list bookings, cancel button.
- [ ] **D4.** Add routing so `/` is booking and `/dashboard` is the dashboard.
- [ ] ✅ **commit** — *why: full app works locally, front to back.*
      `feat: booking page and owner dashboard`

## Phase E — Wire & polish

- [ ] **E1.** Handle the rough edges: loading states, the "slot just taken" (409) message, basic email check.
- [ ] **E2.** Light styling pass so it looks intentional (this is portfolio — it should not look like a tutorial).
- [ ] ✅ **commit** — *why: app is presentable and handles the common failure paths.*
      `polish: states, validation, and styling`

## Phase F — Deploy (live URL)

- [ ] **F1.** Push the repo to GitHub.
- [ ] **F2.** Confirm the Neon database is reachable from the internet (already is) and note its URL.
- [ ] **F3.** Deploy the backend to Render; set `DATABASE_URL` as an env var there; verify it responds live.
- [ ] **F4.** Deploy the frontend to Vercel; set `VITE_API_URL` to the live backend URL; verify the live site works.
- [ ] **F5.** Fix CORS so the live frontend can call the live backend.
- [ ] **F6.** Click through the live URL end to end (book + cancel) as the final check.
- [ ] ✅ **commit** — *why: it's live; record the working deployed state.*
      `chore: deploy to Vercel + Render + Neon`

## Phase G — Ship it as a portfolio piece

- [ ] **G1.** Write `README.md`: what it is, the live link, a screenshot, the stack, "run locally" steps, and the v2 roadmap.
- [ ] **G2.** Final commit + tag `v1.0`.
- [ ] ✅ **commit** — *why: project is shippable and presentable to a client.*
      `docs: README with live link and roadmap`

---

### Current position
Not started — next step is **A1**.
