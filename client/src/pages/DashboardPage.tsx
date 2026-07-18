import { useEffect, useState } from "react";
import { getBookings, cancelBooking, type Booking } from "../api";
import { formatDay, formatTime } from "../format";

function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function loadBookings() {
    const data = await getBookings();
    setBookings(data);
  }

  useEffect(() => {
    loadBookings().finally(() => setLoading(false));
  }, []);

  async function handleCancel(id: string) {
    setMessage("");
    setBusy(true);
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="loading">Loading bookings…</p>;

  return (
    <div>
      <div className="page-head">
        <h1>Bookings</h1>
        <p className="sub">Everything booked through SlotLine.</p>
      </div>

      {message && <p className="message">{message}</p>}

      {bookings.length === 0 ? (
        <div className="empty">No bookings yet. New bookings will show up here.</div>
      ) : (
        <div className="card">
          <div className="table-warp">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>When</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.email}</td>
                    <td>{formatDay(b.startTime)} at {formatTime(b.startTime)}</td>
                    <td>
                      <span className={"badge " + (b.status === "confirmed" ? "badge-ok" : "badge-off")}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === "confirmed" && (
                        <button className="btn-ghost" onClick={() => handleCancel(b.id)} disabled={busy}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;