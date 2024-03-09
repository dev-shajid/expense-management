import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import db from "@/lib/db";
import { signJwtToken } from "@/lib/jwt";
import { validateLoginForm, validateRegisterForm } from "@/helper/validate";

export async function POST(req) {
    try {
        const formData = await req.json()
        let validation = await validateRegisterForm(formData)
        console.log({validation, formData})
        if (Object.keys(validation).length) throw new Error("Invalid Form")
    
        const { name, email, password } = formData
    
        const user = await db.user.findFirst({
            where: {email}
        })
        if(user) throw new Error("Already registered User!");
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })
    
        if (!newUser) throw new Error("Something went wrong!")

        const tokenData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        }
        const token=signJwtToken(tokenData, {expiresIn:'6d'});

        const response = NextResponse.json({
            message: "Register successful!",
            user:tokenData,
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error) {
        // console.log(error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

