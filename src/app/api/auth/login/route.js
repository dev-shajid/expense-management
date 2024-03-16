import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import db from "@/lib/db";
import { signJwtToken } from "@/lib/jwt";
import { validateLoginForm } from "@/helper/validate";

export async function POST(req) {
    try {
        const formData = await req.json()
        let validation = await validateLoginForm(formData)
        // console.log({validation, formData})
        if (Object.keys(validation).length) throw new Error("Invalid Form")
    
        const { email, password } = formData
    
        const user = await db.user.findFirst({
            where: {email}
        })
        console.log({user})
        if(!user) throw new Error("Not registered User!");
        
        const  isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error("Wrong Password!")
        if (!user.verified) throw new Error("Not verified yet!")

        const tokenData = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email
        }
        const token=signJwtToken(tokenData, {expiresIn:'6d'});

        const response = NextResponse.json({
            message: "Login successful!",
            user:tokenData,
            success: true,
        })
        response.cookies.set("token", token, {
            // httpOnly: true,
        })
        return response;
    } catch (error) {
        // console.log(error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

