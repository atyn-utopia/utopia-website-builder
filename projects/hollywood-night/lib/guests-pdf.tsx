import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { EVENT } from "./event";

export type GuestPdfRow = {
  guest_id: string;
  name: string;
  rsvp_type?: string | null;
  company_name?: string | null;
  phone: string;
  email: string;
  attending: boolean;
  has_plus_one: boolean;
  plus_one_name?: string | null;
  created_at: string;
  ticketCount: number;
};

const COLS: { label: string; w: string }[] = [
  { label: "#", w: "4%" },
  { label: "Name", w: "16%" },
  { label: "Type", w: "7%" },
  { label: "Company", w: "16%" },
  { label: "Phone", w: "12%" },
  { label: "Email", w: "18%" },
  { label: "Going", w: "6%" },
  { label: "Plus One", w: "13%" },
  { label: "Tix", w: "4%" },
  { label: "RSVP'd", w: "4%" },
];

const s = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 28,
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: "#111",
  },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#8a6d1f" },
  sub: { fontSize: 8, color: "#555", marginTop: 3 },
  totals: { fontSize: 8, color: "#222", marginTop: 6, marginBottom: 10 },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#1A1E2C",
    color: "#E6C659",
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  rowAlt: { backgroundColor: "#f6f4ee" },
  th: { fontFamily: "Helvetica-Bold", fontSize: 7, paddingHorizontal: 3 },
  td: { paddingHorizontal: 3 },
});

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "";
  }
}

function GuestsDoc({
  guests,
  exportedAt,
}: {
  guests: GuestPdfRow[];
  exportedAt: string;
}) {
  const vip = guests.filter((g) => g.rsvp_type === "vip").length;
  const attendingPeople = guests
    .filter((g) => g.attending)
    .reduce((n, g) => n + 1 + (g.has_plus_one ? 1 : 0), 0);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <Text style={s.title}>{EVENT.name} — Guest List</Text>
        <Text style={s.sub}>Exported: {exportedAt}</Text>
        <Text style={s.totals}>
          {guests.length} RSVP(s) · {attendingPeople} attending (incl. plus-ones)
          · {vip} VIP · {guests.length - vip} Staff
        </Text>

        <View style={s.headerRow} fixed>
          {COLS.map((c) => (
            <Text key={c.label} style={[s.th, { width: c.w }]}>
              {c.label}
            </Text>
          ))}
        </View>

        {guests.map((g, i) => (
          <View
            key={g.guest_id}
            style={i % 2 === 1 ? [s.row, s.rowAlt] : s.row}
            wrap={false}
          >
            <Text style={[s.td, { width: "4%" }]}>{i + 1}</Text>
            <Text style={[s.td, { width: "16%" }]}>{g.name}</Text>
            <Text style={[s.td, { width: "7%" }]}>
              {g.rsvp_type === "vip" ? "VIP" : "Staff"}
            </Text>
            <Text style={[s.td, { width: "16%" }]}>{g.company_name || "—"}</Text>
            <Text style={[s.td, { width: "12%" }]}>{g.phone}</Text>
            <Text style={[s.td, { width: "18%" }]}>{g.email}</Text>
            <Text style={[s.td, { width: "6%" }]}>
              {g.attending ? "Yes" : "No"}
            </Text>
            <Text style={[s.td, { width: "13%" }]}>
              {g.has_plus_one ? g.plus_one_name || "—" : "—"}
            </Text>
            <Text style={[s.td, { width: "4%" }]}>{g.ticketCount}</Text>
            <Text style={[s.td, { width: "4%" }]}>{fmtDate(g.created_at)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function renderGuestsPdf(
  guests: GuestPdfRow[],
  exportedAt: string
): Promise<Buffer> {
  return renderToBuffer(<GuestsDoc guests={guests} exportedAt={exportedAt} />);
}
