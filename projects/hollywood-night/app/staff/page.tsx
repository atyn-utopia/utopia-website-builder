import type { Metadata } from "next";
import EventPage from "../_components/event-page";

export const metadata: Metadata = {
  title: "Staff RSVP — Hollywood Night",
};

export default function StaffPage() {
  return <EventPage variant="staff" />;
}
