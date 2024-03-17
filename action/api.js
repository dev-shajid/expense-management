"use server"

import { authUser } from "@/app/api/apiMiddleWare";
import db from "@/lib/db"
import { cookies } from "next/headers"
import bcrypt from 'bcryptjs'

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
        let basic = (await db.basic.findMany())[0]
        await db.basic.update({ where: { id: basic.id }, data: { ongoing_project: basic.ongoing_project + 1, total_project: basic.total_project + 1 } })
        let project = await db.project.create({ data })
        return project
    } catch (error) {
        console.log({ AddProject_Error: error.message })
        return error
    }
}

export async function EditProject({ id, values }) {
    try {
        let { date, ...data } = values
        if (date) data.start = new Date(date).toISOString()
        if (data.budget) data.budget = Number(data.budget)

        let basic = (await db.basic.findMany())[0]
        let prev_project = await db.project.findFirst({ where: { id } })
        if (prev_project.status != data.status) {
            if (data.status == 'End') await db.basic.update({ where: { id: basic.id }, data: { ongoing_project: basic.ongoing_project - 1 } })
            else await db.basic.update({ where: { id: basic.id }, data: { ongoing_project: basic.ongoing_project + 1 } })
        }

        await db.project.update({ where: { id }, data })
        return { success: true }
    } catch (error) {
        console.log({ EditProject_Error: error.message })
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
        console.log({ GetAllProjects_Error: error.message })
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
export async function AddTransaction({ isPaid = true, data }) {
    try {
        data.date = new Date(data.date).toISOString()
        data.amount = Number(data.amount)
        data.isPaid = isPaid
        if (data.withdrawId) {
            let withdraw = await db.withdraw.findFirst({ where: { id: data.withdrawId } })
            if (withdraw.remaining < data.amount) {
                return { success: false, error: "Insufficient amount!" }
            }
            await db.withdraw.update({ where: { id: withdraw.id }, data: { remaining: withdraw.remaining - data.amount } })
        }

        let base = (await db.basic.findMany())[0]

        let project = await db.project.findFirst({
            where: { id: data.projectId },
            select: { income: true, expense: true, payable: true, receivable: true },
        })

        let baseValue = {
            income: base.income + (data.type == 'income' && data.isPaid ? data.amount : 0),
            expense: base.expense + (data.type == 'expense' && data.isPaid ? data.amount : 0),
            receivable: base.receivable + (data.type == 'income' && !data.isPaid ? data.amount : 0),
            payable: base.payable + (data.type == 'expense' && !data.isPaid ? data.amount : 0),
        }

        let projectValue = {
            income: project.income + (data.type == 'income' && data.isPaid ? data.amount : 0),
            expense: project.expense + (data.type == 'expense' && data.isPaid ? data.amount : 0),
            receivable: project.receivable + (data.type == 'income' && !data.isPaid ? data.amount : 0),
            payable: project.payable + (data.type == 'expense' && !data.isPaid ? data.amount : 0),
        }

        await db.project.update({ where: { id: data.projectId }, data: projectValue })
        await db.basic.update({ where: { id: base.id }, data: baseValue })

        data.to_from = ''
        let transaction = await db.transaction.create({ data })
        return { success: true }
    } catch (error) {
        console.log({ TransactioN_Error: error.message })
        return error
    }
}

export async function EditTransaction({ id, data }) {
    try {
        if (data.date) data.date = new Date(data.date)
        if (data.amount) data.amount = Number(data.amount)
        let prev_transaction = await db.transaction.findFirst({ where: { id } })
        let transaction = await db.transaction.update({ where: { id }, data })
        let { name, projectId, date, amount, type, isPaid } = transaction

        if (data.withdrawId) {
            let withdraw = await db.withdraw.findFirst({ where: { id: data.withdrawId } })
            if (withdraw.remaining + prev_transaction.amount < data.amount) return { success: false, error: "Insufficient amount!" }
            await db.withdraw.update({ where: { id: withdraw.id }, data: { remaining: withdraw.remaining + prev_transaction.amount - data.amount } })
        }


        let base = (await db.basic.findMany())[0]

        let project = await db.project.findFirst({ where: { id: projectId } })
        let projectValue = {
            income: project.income - (prev_transaction.type == 'income' && prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'income' && isPaid ? amount : 0),
            expense: project.expense - (prev_transaction.type == 'expense' && prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'expense' && isPaid ? amount : 0),
            receivable: project.receivable - (prev_transaction.type == 'income' && !prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'expense' && !isPaid ? amount : 0),
            payable: project.payable - (prev_transaction.type == 'expense' && !prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'income' && !isPaid ? amount : 0),
        }

        let baseValue = {
            income: base.income - (prev_transaction.type == 'income' && prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'income' && isPaid ? amount : 0),
            expense: base.expense - (prev_transaction.type == 'expense' && prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'expense' && isPaid ? amount : 0),
            receivable: base.receivable - (prev_transaction.type == 'income' && !prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'expense' && !isPaid ? amount : 0),
            payable: base.payable - (prev_transaction.type == 'expense' && !prev_transaction.isPaid ? prev_transaction.amount : 0) + (type == 'income' && !isPaid ? amount : 0),
        }


        await db.project.update({ where: { id: projectId }, data: projectValue })
        await db.basic.update({ where: { id: base.id }, data: baseValue })

        await AddActivity({ name, project: project.name, date, amount, type, action: 'Updated' })

        return { success: true }
    } catch (error) {
        console.log({ EditTransaction_Error: error.message })
        return error
    }
}

export async function DeleteTransaction(id) {
    try {
        let { name, projectId, date, amount, type, isPaid, withdrawId } = await db.transaction.delete({ where: { id } })

        if (withdrawId) {
            let withdraw = await db.withdraw.findFirst({ where: { id: withdrawId } })
            await db.withdraw.update({ where: { id: withdraw.id }, data: { remaining: withdraw.remaining + amount } })
        }

        let project = await db.project.findFirst({ where: { id: projectId } })
        let data = {
            income: project.income - (type == 'income' && isPaid ? amount : 0),
            expense: project.expense - (type == 'expense' && isPaid ? amount : 0),
            receivable: project.receivable - (type == 'income' && !isPaid ? amount : 0),
            payable: project.payable - (type == 'expense' && !isPaid ? amount : 0),
        }

        let base = (await db.basic.findMany())[0]
        let baseValue = {
            income: base.income - (type == 'income' && isPaid ? amount : 0),
            expense: base.expense - (type == 'expense' && isPaid ? amount : 0),
            receivable: base.receivable - (type == 'income' && !isPaid ? amount : 0),
            payable: base.payable - (type == 'expense' && !isPaid ? amount : 0),
        }

        await db.project.update({ where: { id: projectId }, data })
        await db.basic.update({ where: { id: base.id }, data: baseValue })

        await AddActivity({ name, project: project.name, date, amount, type, action: 'Deleted' })
        return true
    } catch (error) {
        console.log({ TransactioN_Error: error.message })
        return error
    }
}

export async function GetAllTransactions(query) {
    // console.log(query)
    try {
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
        // console.log(transactions)
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

// TODO: Withdraw
export async function AddWithdraw({ data }) {
    try {
        data.date = new Date(data.date).toISOString()
        data.amount = Number(data.amount)
        data.previous = Number(data.previous)
        data.remaining = data.amount + data.previous

        let withdraw = await db.withdraw.create({ data })
        return withdraw
    } catch (error) {
        console.log({ AddWithdraw_Error: error.message })
        return error
    }
}

export async function EditWithdraw({ id, data }) {
    try {
        data.date = new Date(data.date).toISOString()
        data.amount = Number(data.amount)
        data.previous = Number(data.previous)
        data.remaining = Number(data.remaining)

        await db.withdraw.update({ where: { id }, data })
        return true
    } catch (error) {
        console.log({ EditWithdraw_Error: error.message })
        return error
    }
}

export async function DeleteWithdraw({ id }) {
    try {
        await db.withdraw.delete({ where: { id } })
        return true
    } catch (error) {
        console.log({ DeleteWithdraw_Error: error.message })
        return error
    }
}

export async function GetAllWithdraws() {
    try {
        let withdraws = await db.withdraw.findMany({ orderBy: { createdAt: 'desc' } })
        return withdraws
    } catch (error) {
        console.log({ GetAllWithdraws_Error: error.message })
        return error
    }
}

export async function GetWithdraw({ id }) {
    try {
        let withdraw = await db.withdraw.findFirst({ where: { id } })
        if (withdraw?.amount) return withdraw
        throw new Error("Invalid ID!")
    } catch (error) {
        console.log({ GetAllTransactions_Error: error.message })
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

export async function GetAllActiviies({ page, limit = 10 }) {
    try {
        console.log({ page })
        let transactions = await db.activity.findMany({
            skip: (page - 0) * limit,
            take: limit,
            orderBy: { createdAt: 'desc', },
        })
        // console.log({ transactions })
        return transactions
    } catch (error) {
        console.log({ Activity_Error: error.message })
        return error
    }
}

export async function TotalActiviies() {
    try {
        return (await db.activity.count())
    } catch (error) {
        console.log({ Activity_Error: error.message })
        return error
    }
}

// TODO: Customers
export async function GetCustomers() {
    try {
        let customers = await db.customer.findMany({ orderBy: { createdAt: 'desc' } })
        return customers
    } catch (error) {
        console.log({ GetCustomers_Error: error.message })
        return error
    }
}

export async function GetCustomer({ id }) {
    try {
        let customer = await db.customer.findFirst({ where: { id } })
        return customer
    } catch (error) {
        console.log({ GetCustomer_Error: error.message })
        return error
    }
}

export async function AddCustomer({ data }) {
    try {
        let customer = await db.customer.create({ data })
        return customer
    } catch (error) {
        console.log({ AddCustomer_Error: error.message })
        return error
    }
}

export async function EditCustomer({ id, data }) {
    try {
        let customer = await db.customer.update({ where: { id }, data })
        return customer
    } catch (error) {
        console.log({ AddCustomer_Error: error.message })
        return error
    }
}

export async function DeleteCustomer({ id }) {
    try {
        await db.customer.delete({ where: { id } })
    } catch (error) {
        console.log({ AddCustomer_Error: error.message })
        return error
    }
}

// TODO: BASIC
export async function GetBasicInfo() {
    try {
        let info = (await db.basic.findMany())[0]
        return info
    } catch (error) {
        console.log({ GetCustomer_Error: error.message })
        return error
    }
}

// TODO: User
export async function GetAuthUser() {
    try {
        const user = await authUser()
        if (!user) throw new Error("Unauthorized user! sigin again")
        return (await db.user.findFirst({ where: { id: user.id } }))
    } catch (error) {
        console.log({ GetCustomer_Error: error.message })
        return error
    }
}

export async function GetUsers() {
    try {
        let users = await db.user.findMany({ orderBy: { createdAt: 'desc' } })
        return users
    } catch (error) {
        console.log({ GetUsers_Error: error.message })
        return error
    }
}

export async function VerifyUser({ id, role = 'user' }) {
    try {
        await db.user.update({ where: { id }, data: { verified: true, role } })
        return true
    } catch (error) {
        console.log({ GetUsers_Error: error.message })
        return error
    }
}

export async function RoleUser({ id }) {
    try {
        await db.user.update({ where: { id }, data: { role: 'editor' } })
        return true
    } catch (error) {
        console.log({ GetUsers_Error: error.message })
        return error
    }
}

export async function DeleteUser({ id }) {
    try {
        await db.user.delete({ where: { id } })
        return true
    } catch (error) {
        console.log({ GetUsers_Error: error.message })
        return error
    }
}


// TODO: Profile

export async function EditProfile({ id, data }) {
    try {
        let { password, ...user } = await db.user.update({ where: { id }, data })
        return user
    } catch (error) {
        console.log({ GetUsers_Error: error.message })
        return error
    }
}

export async function EditPassword({ id, data }) {
    try {
        let user = await db.user.findFirst({ where: { id } })

        const isValid = await bcrypt.compare(data.old_password, user.password)
        if (!isValid) throw new Error("Wrong Password!")

        const hashedPassword = await bcrypt.hash(data.new_password, 10)
        await db.user.update({ where: { id }, data: { password: hashedPassword } })

        return { success: true }
    } catch (error) {
        console.log({ GetUsers_Error: error.message })
        return { message: error.message, success: false }
    }
}