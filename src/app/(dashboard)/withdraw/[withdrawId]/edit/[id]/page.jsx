'use client'

import React, { useEffect, useState } from 'react'
import Submit from '@/components/Submit';
import { validateAddTransactionForm } from '@/helper/validate';
import { GetAllProjectsTitle } from '../../../../../../../action/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { DateInput } from '@mantine/dates';
import { NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import Loading from '@/components/Loading';

export default function EditTransaction({ params }) {
    const [values, setValues] = useState({ name: '', date: undefined, amount: '', source: '', details: '', type: 'expense', projectId: '', isPaid: true, withdrawId: params.withdrawId })
    const [errors, setErrors] = useState({})
    const [projectNames, setProjectNames] = useState([])
    const router = useRouter()
    const { editTransaction, getTransaction } = useApi()
    let { data, isError, error, isLoading } = getTransaction({ id: params.id })

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
                        router.push(`/withdraw/${params.withdrawId}`)
                        toast.success("Transaction Updated!", { id: loadingPromise })
                    }
                    else throw new Error(res.error)
                },
                onError: (e) => {
                    console.log(e)
                    toast.error(e.message || "Fail to Update Transaction", { id: loadingPromise })
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
        // console.log(data)
        if (data?.name) {
            setValues({ name: data?.name, date: data?.date, amount: data?.amount, source: data?.source, details: data?.details, type: 'expense', projectId: data?.projectId, isPaid: true, withdrawId: params.withdrawId })
        }
    }, [data])

    // if (editTransaction.isError) return <pre>Error: {JSON.stringify(editTransaction.error, null, 2)}</pre>
    if (isError) return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
    if (isLoading) return <Loading page />
    return (
        <section className='container'>
            <Overlay isLoading={editTransaction.isPending} />
            <div className="title">New Projects</div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <DateInput
                    minDate={new Date()}
                    value={values?.date}
                    onChange={(e) => setValues((pre) => ({ ...pre, date: e }))}
                    label="Date"
                    placeholder="Date input"
                    name='date'
                    error={errors?.date}
                    required
                />

                <TextInput
                    value={values.type[0].toUpperCase() + values.type.slice(1)}
                    label="Type"
                    placeholder="Pick value"
                    required
                    readOnly
                />

                <Select
                    label="Project"
                    placeholder="Select Your Project"
                    data={projectNames}
                    value={values?.projectId}
                    name="projectId"
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
                    value={values.source}
                    error={errors?.source}
                    onChange={handleChange}
                    placeholder="Enter the Source"
                />

                <NumberInput
                    label='Amount'
                    name='amount'
                    min={0}
                    value={values.amount}
                    error={errors?.amount}
                    thousandSeparator
                    onChange={(e) => setValues(pre => ({ ...pre, amount: e }))}
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
                    label="Details"
                    placeholder="Enter some details"
                />
                <Submit type='submit' />
            </form>
        </section>
    )
}
