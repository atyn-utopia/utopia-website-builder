import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import { EVENT } from "./event";

Font.register({
  family: "Playfair",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDTbtXK-F2qC0s.ttf",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDTbtPK-F2qC0sz.ttf",
      fontWeight: 900,
    },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#05060A",
    padding: 40,
    fontFamily: "Inter",
    color: "#FBF7EC",
  },
  ticket: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderStyle: "solid",
    backgroundColor: "#0B0D14",
    marginTop: 30,
  },
  left: {
    flex: 3,
    padding: 28,
    borderRightWidth: 1,
    borderRightColor: "#D4AF37",
    borderRightStyle: "dashed",
  },
  right: {
    flex: 1.2,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0E111A",
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 3,
    color: "#D4AF37",
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  title: {
    fontFamily: "Playfair",
    fontWeight: 900,
    fontSize: 26,
    color: "#F6EBD0",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "rgba(251,247,236,0.72)",
    marginBottom: 22,
  },
  guestLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#A8861F",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  guestName: {
    fontFamily: "Playfair",
    fontWeight: 700,
    fontSize: 20,
    color: "#F4DC86",
    marginBottom: 14,
  },
  meta: {
    fontSize: 10,
    color: "rgba(251,247,236,0.72)",
    marginBottom: 3,
  },
  qrBox: {
    backgroundColor: "#F6EBD0",
    padding: 8,
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderStyle: "solid",
  },
  qr: { width: 120, height: 120 },
  admit: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontWeight: 700,
    fontSize: 9,
    color: "#D4AF37",
    letterSpacing: 2,
    marginTop: 10,
  },
  ticketId: {
    fontSize: 8,
    color: "#D4AF37",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  brand: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontWeight: 900,
    fontSize: 32,
    color: "#D4AF37",
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 10,
    color: "rgba(251,247,236,0.72)",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginTop: 4,
  },
  footer: {
    marginTop: 34,
    textAlign: "center",
    fontSize: 9,
    color: "rgba(251,247,236,0.42)",
    fontStyle: "italic",
    fontFamily: "Playfair",
  },
});

export type TicketPdfData = {
  holderName: string;
  ticketId: string;
  qrDataUrl: string;
};

function TicketDoc({ tickets }: { tickets: TicketPdfData[] }) {
  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Hollywood</Text>
          <Text style={styles.brandSub}>Red Carpet Night</Text>
        </View>

        {tickets.map((t) => (
          <View key={t.ticketId} style={styles.ticket} wrap={false}>
            <View style={styles.left}>
              <Text style={styles.eyebrow}>◆ {EVENT.name} · Admit One</Text>
              <Text style={styles.title}>You&apos;re Invited</Text>
              <Text style={styles.subtitle}>{EVENT.subtitle}</Text>

              <Text style={styles.guestLabel}>Guest</Text>
              <Text style={styles.guestName}>{t.holderName}</Text>

              <Text style={styles.meta}>{EVENT.dateLabel}</Text>
              <Text style={styles.meta}>{EVENT.timeLabel}</Text>
              <Text style={styles.meta}>{EVENT.venue}</Text>
              <Text style={styles.meta}>Dress: {EVENT.dressCode}</Text>
            </View>
            <View style={styles.right}>
              <View style={styles.qrBox}>
                <Image src={t.qrDataUrl} style={styles.qr} />
              </View>
              <Text style={styles.admit}>ADMIT ONE</Text>
              <Text style={styles.ticketId}>{t.ticketId}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>See you on the red carpet.</Text>
      </Page>
    </Document>
  );
}

export async function renderTicketsPdf(
  tickets: TicketPdfData[]
): Promise<Buffer> {
  return renderToBuffer(<TicketDoc tickets={tickets} />);
}
