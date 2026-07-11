import { useEffect, useState } from "react";
import { getBookings, cancelBooking, type Booking } from "../api";
import { formatDay, formatTime } from "../format";

function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [message, setMessage] = useState("");

    async function loadBookings() {
        const data = await getBookings();
        setBookings(data);
    }

    useEffect(() => {
        loadBookings();
    }, []);

    async function handleCancel(id: string) {
        setMessage("");
        try {
            await cancelBooking(id);
            await loadBookings();
        } catch (err) {
            setMessage(err instanceof Error ? err.message: "Failed to cancel");
        }
    }

    return (
        <div>
            <h1>Bookings dashboard</h1>

            {message && <p>{message}</p>}

            {bookings.length === 0 ? (
                <p>No bookings yet.</p>
            ): (
                <table>
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
                                <td>{b.status}</td>
                                <td>
                                    {b.status === "confirmed" && (
                                        <button onClick={() => handleCancel(b.id)}>Cancel</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DashboardPage;