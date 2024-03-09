export default async function wait(time=2000){
    return await new Promise(res=>setTimeout(res, time))
}