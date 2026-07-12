import cors from "cors";
import express from "express";
import { prisma } from "./prisma";
import { generateSlots } from "./slots";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL || "",
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
const PORT  = process.env.PORT || 4000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Slotline server is running"});
});

app.get("/api/slots", async (req, res) => {
    try {
        const slots = generateSlots();

        const bookings = await prisma.booking.findMany({
            where: { status: "confirmed" },
            select: { startTime: true },
        });

        const taken = new Set(bookings.map((b) => b.startTime.toISOString()));

        const result = slots.map((slot) => ({
            startTime: slot.toISOString(),
            available: !taken.has(slot.toISOString()),
        }));

        res.json(result);
    } catch (error) {
        console.error("GET /api/slots failed: ", error);
        res.status(500).json({ error: "Failed to load slots" });
    }
});

app.post("/api/bookings", async (req, res) => {
    try {
        const { name, email, startTime } = req.body;

        //1. Required field presents?
        if (!name || !email || !startTime) {
            res.status(400).json({error: "name, email, and startTime are required"});
            return;
        }

        //2. Email at least shaped like an email?
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({error: "Invalid email"});
            return;
        }

        //3. Is this even a real slot offered? (Never trust the caller)
        const slotIsReal = generateSlots().some(
            (slot) => slot.toISOString() === startTime
        );
        if (!slotIsReal) {
            res.status(400).json({error: "That is not a valid slot"});
            return;
        }

        //4. Re-check availability at save time
        const existing = await prisma.booking.findFirst({
            where: { startTime: new Date(startTime), status: "confirmed"},
        });
        if (existing) {
            res.status(409).json({errro: "Slot no longer available"});
            return;
        }

        //5. All checks passed - save it
        const booking = await prisma.booking.create({
            data: { name, email, startTime: new Date(startTime) },
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error("POST /api/bookings failed:", error);
        res.status(500).json({error: "Failed to create booking"});
    }   
});

app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(bookings);
    } catch (error) {
        console.error("GET /api/bookings failed:", error);
        res.status(500).json({ error: "Failed to load bookings" });
    }
});

app.patch("/api/bookings/:id/cancel", async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: "cancelled" },
        });

        res.json({ id: booking.id, status: booking.status });
    } catch (error) {
        if ((error as any).code === "P2025") {
            res.status(404).json({ error: "Booking not found" });
            return;
        }
        console.error("PATCH /api/bookings/:id/cancel failed:", error);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});