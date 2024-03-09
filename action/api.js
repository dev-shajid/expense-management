"use server"

import db from "@/lib/db"
import { cookies } from "next/headers"

export async function Logout() {
    try {
        cookies().delete('token');
        return true
    } catch (error) {
        return error
    }
}

// TODO: Project
export async function AddProject(data) {
    try {
        // data.start = new Date(data.start).toISOString()
        data.budget = Number(data.budget)
        console.log(data)
        let project = await db.project.create({ data })
        return project
    } catch (error) {
        return error
    }
}

export async function GetAllProjects() {
    try {
        let projects = await db.project.findMany({
            orderBy:{
                start: 'desc',
            }
        })
        return projects
    } catch (error) {
        return error
    }
}

export async function GetProject(id) {
    try {
        let project = await db.project.findFirst({ where: { id } })
        return project
    } catch (error) {
        return error
    }
}