'use client'

import React, { useEffect, useState } from 'react'
import Submit from '@/components/Submit';
import { validateAddTransactionForm } from '@/helper/validate';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { DateInput } from '@mantine/dates';
import { Select, TextInput, Textarea } from '@mantine/core';
import Loading from '@/components/Loading';
import { GetAllProjectsTitle } from '../../../../../../../action/api';

export default function AddNewTransaction({ params }) {
    const [values, setValues] = useState({ name: '', date: null, amount: '', source: '', details: '', type: '', projectId: '', isPaid: false })
    const [errors, setErrors] = useState({})
    const [projectNames, setProjectNames] = useState([])
    const router = useRouter()
    const { editTransaction, getTransaction } = useApi()
    let { data, isError, error, isLoading } = getTransaction({ id: params.id, isPaid: false })

    function handleChange(e) {
        setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let d = await validateAddTransactionForm(values)
        setErrors(d)
        // console.log(d)
        if (!Object.keys(d).length) {
            // alert(JSON.stringify(values, null, 2))
            let loadingPromise = toast.loading("Loading...")
            editTransaction.mutate({ id: params.id, data: values }, {
                onSuccess: (res) => {
                    if (res.success) {
                        router.push('/accounts/receivable')
                        toast.success("Transaction Successful!", { id: loadingPromise })
                    }
                    else throw new Error(res.error)
                },
                onError: (e) => {
                    console.log(e)
                    toast.error(e?.message || "Fail to create Project", { id: loadingPromise })
                },
            })
        }
    }

    async function getProjectNames() {
        let arr = await GetAllProjectsTitle()
        setProjectNames(arr);
    }

    useEffect(() => {
        getProjectNames()
    }, [])

    useEffect(() => {
        if (data?.name) {
            setValues({ name: data?.name, date: data?.date, amount: data?.amount, source: data?.source, details: data?.details, type: data?.type, projectId: data?.projectId, isPaid: data?.isPaid })
        }
    }, [data])

    if (editTransaction.isError) return <pre>Error: {JSON.stringify(editTransaction.error, null, 2)}</pre>
    if (isError) return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
    if (isLoading) return <Loading page />
    return (
        <section className='container'>
            <Overlay isLoading={editTransaction.isPending} />
            <div className="title">New Projects</div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <DateInput
                    minDate={new Date()}
                    value={values.date}
                    onChange={(e) => setValues((pre) => ({ ...pre, date: e }))}
                    label="Date"
                    placeholder="Date input"
                    name='date'
                    error={errors?.date}
                    required
                />

                <Select
                    data={[{ label: 'Income', value: 'income' }, { label: 'Expense', value: 'expense' }]}
                    value={values.type}
                    name='type'
                    onChange={(v) => setValues(p => ({ ...p, type: v }))}
                    label="Type"
                    error={errors?.type}
                    placeholder="Pick value"
                    required
                />

                <Select
                    label="Project"
                    placeholder="Select Your Project"
                    data={projectNames}
                    name="projectId"
                    value={values.projectId}
                    error={errors?.projectId}
                    onChange={(v) => setValues(p => ({ ...p, projectId: v }))}
                    required
                    searchable
                />

                <TextInput
                    label="Name"
                    name='name'
                    type='text'
                    value={values.name}
                    error={errors?.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    required
                />

                <TextInput
                    label="Source"
                    name='source'
                    type='text'
                    value={values?.source}
                    error={errors?.source}
                    onChange={handleChange}
                    placeholder="Enter the Source"
                />

                <TextInput
                    label='Amount'
                    name='amount'
                    type='number'
                    min={0}
                    value={values.amount}
                    error={errors?.amount}
                    onChange={handleChange}
                    onWheel={e => e.target.blur()}
                    placeholder="Enter the Amount"
                    required
                />

                <Textarea
                    name='details'
                    value={values.details}
                    onChange={handleChange}
                    autosize
                    minRows={5}
                    label="Project Details"
                    placeholder="Enter some details"
                />
                <Submit />
            </form>
        </section>
    )
}
