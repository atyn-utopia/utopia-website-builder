declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void;
  }
}
export {};
