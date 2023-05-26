import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
    const url = new URL(request.url);

    const company = url.searchParams.get('company');
    if (!company) {
        // Redirect to a different URL if "pid" or "company" is missing
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*',
};