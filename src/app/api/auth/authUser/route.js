import verifyToken from "@/lib/verifyToken";
import { NextResponse } from "next/server";
import { authUser } from "../../apiMiddleWare";
import { cookies, headers } from 'next/headers'


export async function GET(req) {
    try {
        const user = await authUser()
        if (!user) throw new Error("Unauthorized user! sigin again")
        // console.log({user})

        return NextResponse.json({ message: "Authorized Succesfully!", user, success: true, }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}