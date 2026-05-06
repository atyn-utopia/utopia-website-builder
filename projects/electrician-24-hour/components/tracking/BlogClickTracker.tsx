'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type LinkProps = ComponentProps<typeof Link>;

type Props = LinkProps & {
  slug: string;
  children: ReactNode;
};

/**
 * Drop-in replacement for next/link that fires
 * `window.uwc('click', { label: 'blog-<slug>' })` on click before navigation.
 *
 * The original onClick (if any) still runs.
 */
export default function BlogClickTracker({
  slug,
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        if (typeof window !== 'undefined' && window.uwc) {
          window.uwc('click', { label: `blog-${slug}` });
        }
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
