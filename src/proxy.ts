import {NextRequest, NextResponse} from 'next/server';

const shouldUseIntlProxy =
  process.env.NODE_ENV === 'production' &&
  (process.env.GITHUB_ACTIONS === 'true' || process.env.ENABLE_I18N_PROXY === 'true');

export default async function proxy(request: NextRequest) {
  if (!shouldUseIntlProxy) {
    return NextResponse.next();
  }

  const [{default: createMiddleware}, {routing}] = await Promise.all([
    import('next-intl/middleware'),
    import('./i18n/routing')
  ]);

  return createMiddleware(routing)(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};

