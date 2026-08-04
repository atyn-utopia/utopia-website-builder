// Utopia Webcore analytics (t.js) — see docs/tracking-guide.md.
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void;
  }
}
export {};
