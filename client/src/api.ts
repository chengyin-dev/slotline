const API_URL = import.meta.env.VITE_API_URL;

export type Slot = { startTime: string; available: boolean };
export type Booking = {
    id: string;
    name: string;
    email: string;
    startTime: string;
    status: string;
    createdAt: string;
};

export async function getSlots(): Promise<Slot[]> {
    const res = await fetch(`${API_URL}/api/slots`);
    if (!res.ok) throw new Error("Failed to load slots");
    return res.json();
}

export async function createBooking(data: {
    name: string;
    email: string;
    startTime: string;
}): Promise<Booking> {
    const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create booking");
    }
    return res.json();
}

export async function getBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_URL}/api/bookings`);
    if (!res.ok) throw new Error("Failed to load bookings");
    return res.json();
}

export async function cancelBooking(id: string): Promise<{ id: string; status: string }> {
    const res = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to cancel booking");
    return res.json();
}