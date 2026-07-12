import { useEffect, useState } from "react";
import { getSlots, createBooking, type Slot } from "../api";
import { formatDay, formatTime } from "../format";

function BookingPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadSlots() {
    const data = await getSlots();
    setSlots(data);
  }

  useEffect(() => {
    loadSlots().finally(() => setLoading(false));
  }, []);

  async function handleBook() {
    setMessage("");
    if (!name || !email || !selected) {
      setMessage("Please enter your name, email, and pick a slot.");
      return;
    }
    setSubmitting(true);
    try {
      await createBooking({ name, email, startTime: selected });
      setMessage(`Booked ${formatDay(selected)} at ${formatTime(selected)}.`);
      setSelected(null);
      setName("");
      setEmail("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      await loadSlots();
      setSubmitting(false);
    }
  }

  const days = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const day = formatDay(slot.startTime);
    (acc[day] ||= []).push(slot);
    return acc;
  }, {});

  if (loading) return <p className="loading">Loading slots…</p>;

  return (
    <div>
      <div className="page-head">
        <h1>Book an appointment</h1>
        <p className="sub">Pick a time that works — we'll hold it for you.</p>
      </div>

      <div className="fields">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            className="input"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {Object.entries(days).map(([day, daySlots]) => (
        <section className="day" key={day}>
          <h3 className="day-label">{day}</h3>
          <div className="slots">
            {daySlots.map((slot) => (
              <button
                key={slot.startTime}
                className={"slot" + (selected === slot.startTime ? " is-selected" : "")}
                disabled={!slot.available}
                onClick={() => setSelected(slot.startTime)}
              >
                {formatTime(slot.startTime)}
              </button>
            ))}
          </div>
        </section>
      ))}

      <div className="actions">
        <button className="btn-primary" onClick={handleBook} disabled={submitting}>
          {submitting ? "Booking…" : "Book selected slot"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default BookingPage;