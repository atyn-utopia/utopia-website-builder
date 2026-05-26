// Type declaration for the Utopia Webcore tracking client. The `t.js` script
// in app/[locale]/layout.tsx attaches `window.uwc` at runtime; this typedef
// lets components call `window.uwc('click', { label: 'whatsapp-...' })`
// without TypeScript errors.
declare global {
  interface Window {
    uwc: (eventType: string, options?: { label?: string }) => void
  }
}

export {}
