// projects/skylift-malaysia/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude api, the /manage admin page, Next internals, and files with extensions.
    '/((?!api|manage|_next|_vercel|.*\\..*).*)',
  ],
};
