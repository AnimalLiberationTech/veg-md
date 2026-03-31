import type {NextRequest} from 'next/server';
import i18nProxy from './i18n/proxy';

export async function proxy(request: NextRequest) {
  return i18nProxy(request);
}

export default proxy;

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};

