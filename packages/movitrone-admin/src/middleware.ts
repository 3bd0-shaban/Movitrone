import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const themeCookie = request.cookies.get('theme');
  let theme = themeCookie ? themeCookie.value : null;

  if (!theme) {
    // Get the system default theme
    const prefersDarkMode =
      request.headers.get('sec-ch-prefers-color-scheme') === 'dark';
    theme = prefersDarkMode ? 'dark' : 'light';

    // Set the theme cookie
    const response = NextResponse.next();
    response.cookies.set('theme', theme, {
      secure: true,
      httpOnly: false,
      sameSite: 'strict',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply this middleware to all routes
};
