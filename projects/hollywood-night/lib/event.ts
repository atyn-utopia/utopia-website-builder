export const EVENT = {
  name: "Hollywood Night",
  subtitle: "Red Carpet Annual Dinner",
  dateISO: "2026-05-16",
  dateLabel: "Saturday, 16 May 2026",
  timeLabel: "6:00 PM – 11:00 PM",
  venue: "D'Intan Hall",
  venueAddress:
    "Level 2, Sentul Point, Jln Sentul Pasar, Sentul, 51000 Kuala Lumpur",
  dressCode: "Black Tie Glamour",
  organizer: "Utopia Group of Companies",
  contactEmail: "design.utco@gmail.com",
} as const;

/** Run-of-show for the evening. `details` render as fine-print sub-items. */
export const AGENDA: { time: string; title: string; details?: string[] }[] = [
  {
    time: "6:30 – 6:45 PM",
    title: "Guest Arrival & Pre-Event Mingle",
    details: [
      "Casual welcome, photo session, mingling",
      "Masquerade backdrop & light refreshments",
    ],
  },
  {
    time: "6:45 – 7:00 PM",
    title: "Registration & VIP Arrival",
    details: ["Final check-in", "VIP photo session"],
  },
  { time: "7:00 – 7:10 PM", title: "Event Kickoff & Doa Recitation" },
  { time: "7:10 – 7:40 PM", title: "Welcome Speeches" },
  { time: "7:40 – 7:45 PM", title: "Opening Game (Murder Mystery)" },
  {
    time: "7:45 – 8:15 PM",
    title: "Dinner Begins",
    details: ["Light background music, montage"],
  },
  { time: "8:15 – 8:35 PM", title: "Masquerade Game – Round 1" },
  { time: "8:35 – 8:40 PM", title: "Lucky Draw – Round 1" },
  { time: "8:40 – 8:45 PM", title: "Mid-Show Performance" },
  { time: "8:40 – 10:25 PM", title: "Masquerade Game – Round 2" },
  { time: "10:25 – 10:40 PM", title: "Lucky Draw – Round 2" },
  { time: "10:40 – 10:55 PM", title: "Lucky Draw – Round 3" },
  { time: "10:55 – 11:10 PM", title: "Lucky Draw – Round 4" },
  {
    time: "11:10 – 11:25 PM",
    title: "Awards Ceremony",
    details: [
      "Masquerade Magnificent (Best Dressed Male & Female)",
      "Most Beautiful Mask (Most Unique)",
    ],
  },
  { time: "11:25 – 11:35 PM", title: "Group Photography Session" },
  {
    time: "11:35 PM till end",
    title: "Dismissal & Mingling",
    details: ["Light music, photo opportunities"],
  },
];
