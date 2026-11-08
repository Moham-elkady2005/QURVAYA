import { NextResponse, type NextRequest } from 'next/server';

const SURAH_PATH = /^\/surah\/([^/]+)\/?$/;

/**
 * Surah pages use Cache Components, so their static shell starts streaming
 * before a runtime `notFound()` can set the status code. Validate the number
 * here, before rendering, so invalid surah URLs get a real 404 response.
 */
export function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(SURAH_PATH);

  if (!match) {
    return NextResponse.next();
  }

  const raw = match[1];

  if (/^\d+$/.test(raw)) {
    const number = Number(raw);

    if (number >= 1 && number <= 114) {
      if (raw !== String(number)) {
        const url = request.nextUrl.clone();
        url.pathname = `/surah/${number}`;
        return NextResponse.redirect(url, 308);
      }

      return NextResponse.next();
    }
  }

  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = '/404';
  notFoundUrl.search = '';

  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

export const config = {
  matcher: '/surah/:path*',
};
