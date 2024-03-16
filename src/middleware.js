import { NextResponse } from "next/server";
import verifyToken from "./lib/verifyToken";

export default async function middleware(req) {
    try {
        let path = req?.nextUrl?.pathname
        let token = req?.cookies?.get('token')?.value || ''

        let decode = token ? await verifyToken(token) : null
        // console.log({decode, token, path})

        if (path?.startsWith('/signin') || path?.startsWith('/signup')) {
            if (decode?.id) {
                return NextResponse.redirect(new URL('/', req.url))
            }
            let response = NextResponse.next()
            return response
        }
        else {
            if (!decode || !decode?.id) {
                let response = NextResponse.redirect(new URL('/signin', req.url))
                response.cookies.delete('token')
                return response
            }
            if (path?.startsWith('/admin') || path?.startsWith('/projects')) {
                if (decode?.role == 'admin') return NextResponse.next()
                return NextResponse.redirect(new URL('/', req.url))
            }
            return NextResponse.next()
        }
    } catch (error) {
        console.log({ error })
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export const config = {
    matcher: [
        '/',
        '/admin', '/projects', 
        '/projects/:path*',
        '/signin', '/signup',
    ]
}