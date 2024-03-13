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
        // console.log({projects})
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
        let titles = (await db.project.findMany({ orderBy: { createdAt: 'desc' } })).map(e => ({ label: e.name, value: e.id }))
        return titles
    } catch (error) {
        return error
    }
}

// TODO: Transaction
export async function AddTransaction({ isPaid, data }) {
    try {
        data.date = new Date(data.date).toISOString()
        data.amount = Number(data.amount)
        data.isPaid = isPaid

        let project = await db.project.findFirst({ where: { id: data.projectId } })
        if (isPaid == true) {
            if (data.type == 'income') await db.project.update({ where: { id: data.projectId }, data: { income: project.income + data.amount } })
            else await db.project.update({ where: { id: data.projectId }, data: { expense: project.expense + data.amount } })
        }
        else {
            if (data.type == 'income') await db.project.update({ where: { id: data.projectId }, data: { receivable: project.receivable + data.amount } })
            else await db.project.update({ where: { id: data.projectId }, data: { payable: project.payable + data.amount } })
        }

        data.to_from = ''
        let transaction = await db.transaction.create({ data })
        // console.log(transaction)
        return transaction
    } catch (error) {
        console.log({ TransactioN_Error: error.message })
        return error
    }
}

export async function EditTransaction({ id, data }) {
    try {
        data.date = new Date(data.date)
        data.amount = Number(data.amount)
        let transaction = await db.transaction.update({ where: { id }, data })

        let { name, projectId, date, amount, type } = transaction
        let project = (await db.project.findFirst({ where: { id: projectId } })).name
        await AddActivity({ name, project, date, amount, type, action: 'Updated' })

        return transaction
    } catch (error) {
        console.log({ TransactioN_Error: error.message })
        return error
    }
}

export async function DeleteTransaction(id) {
    try {
        let { name, projectId, date, amount, type } = await db.transaction.delete({ where: { id } })
        let project = (await db.project.findFirst({ where: { id: projectId } })).name
        await AddActivity({ name, project, date, amount, type, action: 'Deleted' })
        return true
    } catch (error) {
        console.log({ TransactioN_Error: error.message })
        return error
    }
}

export async function GetAllTransactions({ isPaid, type }) {
    try {
        let query = { isPaid }
        if (type) query.type = type
        let transactions = await db.transaction.findMany({
            where: query,
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
        console.log({ GetAllTransactions_Error: error.message })
        return error
    }
}

export async function GetTransaction(id, isPaid, type) {
    try {
        let query = { isPaid, id }
        if (type) query.type = type
        let transactions = await db.transaction.findFirst({
            where: query,
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
        console.log({ GetAllTransactions_Error: error.message })
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


export async function AddActivity({ name, project, amount, type, action }) {
    try {
        let activity = await db.activity.create({
            data: { name, project, amount, type, action }
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
        })
        // console.log({ transactions })
        return transactions
    } catch (error) {
        console.log({ Activity_Error: error.message })
        return error
    }
}