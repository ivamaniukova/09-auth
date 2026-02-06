import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (!isPublicRoute && !isPrivateRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!accessToken) {
    if (refreshToken) {
      const res = await checkSession();
      const setCookie = res.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        const response = isPublicRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          if (parsed.accessToken) response.cookies.set('accessToken', parsed.accessToken);
          if (parsed.refreshToken) response.cookies.set('refreshToken', parsed.refreshToken);
        }

        return response;
      }
    }

    if (isPublicRoute) return NextResponse.next();
    if (isPrivateRoute) return NextResponse.redirect(new URL('/sign-in', request.url));

    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};