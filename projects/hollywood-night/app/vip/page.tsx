import type { Metadata } from "next";
import EventPage from "../_components/event-page";

export const metadata: Metadata = {
  title: "VIP RSVP — Hollywood Night",
};

export default function VipPage() {
  return <EventPage variant="vip" />;
}
