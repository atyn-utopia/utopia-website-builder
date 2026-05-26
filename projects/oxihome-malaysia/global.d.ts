// projects/skylift-malaysia/global.d.ts
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void;
  }
}
export {};
