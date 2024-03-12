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
export async function AddProject(values) {
    try {
        let { date, ...data } = values
        data.start = new Date(date).toISOString()
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
            orderBy: {
                createdAt: 'desc',
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

export async function GetAllProjectsTitle() {
    try {
        let titles = (await db.project.findMany({orderBy:{createdAt: 'desc'}})).map(e => ({ label: e.name, value: e.id }))
        return titles
    } catch (error) {
        return error
    }
}

// TODO: Transaction
export async function AddTransaction(data) {
    try {
        data.date = new Date(data.date).toISOString()
        data.amount = Number(data.amount)
        data.to_from = ''
        let transaction = await db.transaction.create({ data })
        await AddActivity(transaction.id, data.projectId)
        // console.log({ transaction })
        // return transaction
    } catch (error) {
        console.log({ TransactioN_Error: error.message })
        return error
    }
}

export async function GetAllTransactions() {
    try {
        let transactions = await db.transaction.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                project: {
                    select: {
                        name: true,
                    }
                }
            }
        })
        return transactions
    } catch (error) {
        return error
    }
}

export async function GetProjectsTransaction(id) {
    try {
        let transactions = await db.transaction.findMany(
            {
                where: {
                    projectId: id,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    project: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        )
        return transactions
    } catch (error) {
        return error
    }
}

// TODO: Activity


export async function AddActivity(transactionId, projectId) {
    try {
        let activity = await db.activity.create({
            data: {
                transactionId,
                // projectId,
            }
        })
        return activity
    } catch (error) {
        console.log({ ActivityError: error.message })
        return error
    }
}

export async function GetAllActiviies() {
    try {
        let transactions = await db.activity.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                transaction: {
                    select: {
                        name: true,
                        date: true,
                        amount: true,
                        type: true,
                        id: true,
                        project: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
            }
        })
        return transactions
    } catch (error) {
        return error
    }
}