'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

/**
 * Collects styled-jsx styles during SSR and injects them into the streamed
 * HTML. Without this, `<style jsx>` rules (e.g. SiteHeader) are only added on
 * the client after hydration, so the header paints unstyled first — a
 * flash/glitch on load. Required for styled-jsx in the App Router.
 */
export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [registry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = registry.styles();
    registry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>;
}
