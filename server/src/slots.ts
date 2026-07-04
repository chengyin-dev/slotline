// Business rules - change these to change availability everywhere.
const SLOT_START_HOUR = 9; // first slot start at 9:00
const SLOT_END_HOUR = 17; // last slot ends by 17:00 (so last start is 16:30)
const SLOT_INTERVAL_MIN = 30; // minutes between slots
const DAY_AHEAD = 7; //how many days of slots to generate

// Return every possible appointment start-time for the next 7 days
export function generateSlots(): Date[] {
    const slots: Date[] = [];
    const now = new Date();

    for (let day = 1; day <= DAY_AHEAD; day++) {
        for (let hour = SLOT_START_HOUR; hour < SLOT_END_HOUR; hour++) {
            for (let min = 0; min < 60; min += SLOT_INTERVAL_MIN) {
                const slot = new Date(Date.UTC(
                    now.getUTCFullYear(),
                    now.getUTCMonth(),
                    now.getUTCDate() + day,
                    hour,
                    min,
                    0,
                    0
                ));
                slots.push(slot);
            }
        }
    }

    return slots;
}