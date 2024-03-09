import { jwtVerify, SignJWT } from "jose";

export function getJwtSecretKey() {
    let secret = process.env.SECRET

    if (secret) return secret
    throw new Error("No SECRET KEY is provided!")
}

export default async function verifyToken(token) {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
        return verified.payload
    } catch (error) {
        console.log({ ErrorVerifyToken: error.message })
        return error.message
    }
}


export async function signToken(payload, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60* 60 * 24; // 24 * one hour

    return new SignJWT({...payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}