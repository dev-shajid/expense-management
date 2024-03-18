'use client'

import React, { useEffect, useState } from 'react'
import Submit from '@/components/Submit';
import { validateAddTransactionForm } from '@/helper/validate';
import { AddProject, AddTransaction, GetAllProjectsTitle } from '../../../../../action/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { DateInput } from '@mantine/dates';
import { Autocomplete, Select, TextInput, Textarea } from '@mantine/core';

export default function AddNewTransaction() {
    const [values, setValues] = useState({ name: '', date: undefined, amount: '', source: '', details: '', type: '', projectId: '', isPaid: true })
    const [errors, setErrors] = useState({})
    const [projectNames, setProjectNames] = useState([])
    const router = useRouter()
    const { creatTransaction } = useApi()

    function handleChange(e) {
        setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let d = await validateAddTransactionForm(values)
        setErrors(d)
        console.log(d)
        if (!Object.keys(d).length) {
            // alert(JSON.stringify(values, null, 2))
            let loadingPromise = toast.loading("Loading...")
            creatTransaction.mutate(({ data: values, isPaid: true }), {
                onSuccess: () => {
                    router.push('/transactions')
                    toast.success("Transaction Successful!", { id: loadingPromise })
                },
                onError: (e) => {
                    toast.error("Fail to create Transaction", { id: loadingPromise })
                },
            })
        }
    }

    async function getProjectNames() {
        let arr = await GetAllProjectsTitle()
        // console.log(arr)
        setProjectNames(arr);
    }

    useEffect(() => {
        getProjectNames()
    }, [])

    // if (creatTransaction.isError) return <pre>{JSON.stringify(creatTransaction.error, null, 2)}</pre>
    return (
        <section className='container'>
            <Overlay isLoading={creatTransaction.isPending} />
            <div className="title">New Transaction</div>
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

                <Select
                    data={[{ label: 'Income', value: 'income' }, { label: 'Expense', value: 'expense' }]}
                    value={values.type}
                    name='type'
                    onChange={(v) => setValues(p => ({ ...p, type: v.toLowerCase() }))}
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
                <Submit type='submit' />
            </form>
        </section>
    )
}