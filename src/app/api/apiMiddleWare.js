import verifyToken from "@/lib/verifyToken";
import { cookies, headers } from "next/headers";

export const authUser = async (req) => {
    let token = cookies().get('token')?.value || headers()?.get('token') || ''
    let decode = token ? await verifyToken(token) : null

    // console.log({ decode, token });
    if (!decode || !decode?.id) return false
    return decode
}