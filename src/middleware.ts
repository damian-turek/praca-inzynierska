import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

function parseJwt(token: string) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    } catch {
        return null;
    }
}

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('jwt')?.value;

    if (!token) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    const payload = parseJwt(token);
    if (!payload || !payload.role) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    const role = payload.role;
    const path = req.nextUrl.pathname;

    if (role === 'ADMIN' && path.startsWith('/user')) {
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    if (role === 'USER' && path.startsWith('/admin')) {
        url.pathname = '/user/dashboard';
        return NextResponse.redirect(url);
    }

    if (role === 'ADMIN' && !path.startsWith('/admin')) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    if (role === 'USER' && !path.startsWith('/user')) {
        url.pathname = '/user';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*'],
};
