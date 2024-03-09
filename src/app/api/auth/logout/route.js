import db from "@/lib/db"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET() {
    try {
        await db.connect()
        cookies().delete('token')
        const response = NextResponse.json({
            message: 'Logout Successful!',
            success: true,
        })
        response.cookies.set('token', '', {
            httpOnly: true, 
            expires: new Date(0)
        })
        return response
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}