import Image from "next/image";

export default function TicketPreview() {
  return (
    <div
      className="relative mx-auto max-w-3xl"
      style={{ transform: "rotate(-1.2deg)" }}
    >
      <div className="relative border border-gold-500/70 shadow-ticket overflow-hidden">
        <Image
          src="/ticket.png"
          alt="Hollywood Red Carpet — Admit One ticket"
          width={1600}
          height={580}
          className="block w-full h-auto"
        />
      </div>
    </div>
  );
}
