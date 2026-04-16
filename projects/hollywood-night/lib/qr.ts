import QRCode from "qrcode";

// Pure black-on-white maximises scanner reliability.
// Do not stylize — colored QR codes reduce decoder contrast.
const QR_OPTIONS = {
  errorCorrectionLevel: "H" as const,
  margin: 2,
  width: 512,
  color: { dark: "#000000", light: "#FFFFFF" },
};

export async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, QR_OPTIONS);
}

export async function qrPngBuffer(text: string): Promise<Buffer> {
  return QRCode.toBuffer(text, QR_OPTIONS);
}
