import { useEffect, useState } from "react";
import { getSlots, createBooking, type Slot } from "../api";
import { formatDay, formatTime } from "../format";


function BookingPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadSlots() {
    const data = await getSlots();
    setSlots(data);
  }

  useEffect(() => {
    loadSlots();
  }, []);

  async function handleBook() {
    setMessage("");
    if (!name || !email || !selected) {
      setMessage("Please enter your name, email, and pick a slot.");
      return;
    }
    try {
      await createBooking({ name, email, startTime: selected });
      setMessage(`Booked ${formatDay(selected)} at ${formatTime(selected)}!`);
      setSelected(null);
      setName("");
      setEmail("");
      await loadSlots();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const days = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const day = formatDay(slot.startTime);
    (acc[day] ||= []).push(slot);
    return acc;
  }, {});

  return (
    <div>
      <h1>Book an appointment</h1>

      <div>
        <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {Object.entries(days).map(([day, daySlots]) => (
        <div key={day}>
          <h3>{day}</h3>
          {daySlots.map((slot) => (
            <button
              key={slot.startTime}
              disabled={!slot.available}
              onClick={() => setSelected(slot.startTime)}
            >
              {formatTime(slot.startTime)}
              {selected === slot.startTime ? " ✓" : ""}
            </button>
          ))}
        </div>
      ))}

      <div>
        <button onClick={handleBook}>Book selected slot</button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

export default BookingPage;