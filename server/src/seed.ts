import { PrismaClient } from "@prisma/client";
import { generateSlots } from "./slots";

const prisma = new PrismaClient();

const demoBookings = [
  { name: "Aisyah Rahman",   email: "aisyah.rahman@gmail.com",  slotIndex: 2,  status: "confirmed" },
  { name: "Daniel Okafor",   email: "d.okafor@outlook.com",     slotIndex: 6,  status: "confirmed" },
  { name: "Priya Menon",     email: "priya.menon@gmail.com",    slotIndex: 19, status: "confirmed" },
  { name: "Marcus Lindqvist",email: "m.lindqvist@fastmail.com", slotIndex: 27, status: "cancelled" },
  { name: "Chen Wei Ling",   email: "weiling.chen@gmail.com",   slotIndex: 35, status: "confirmed" },
  { name: "Sofia Almeida",   email: "sofia.almeida@proton.me",  slotIndex: 44, status: "confirmed" },
  { name: "Tom Bradbury",    email: "tom.bradbury@gmail.com",   slotIndex: 58, status: "confirmed" },
];

async function main() {
    const slots = generateSlots();

    await prisma.booking.deleteMany();
    console.log("Cleared existing bookings.");

    for (const b of demoBookings) {
        await prisma.booking.create({
            data: {
                name: b.name,
                email: b.email,
                startTime: slots[b.slotIndex],
                status: b.status,
            },
        });
    }

    console.log(`Seeded ${demoBookings.length} bookings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());