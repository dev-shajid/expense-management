'use client'

import React, { useEffect, useState } from 'react'
import Submit from '@/components/Submit';
import { validateAddTransactionForm } from '@/helper/validate';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { DateInput } from '@mantine/dates';
import { TextInput, Textarea } from '@mantine/core';

export default function AddNewTransaction() {
    const [values, setValues] = useState({ date: undefined, amount: '', previous: '', remaining: '', bank_account: '', details: '' })
    const [errors, setErrors] = useState({})
    const router = useRouter()
    const { creatWithdraw } = useApi()

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
            creatWithdraw.mutate(({ data: values }), {
                onSuccess: () => {
                    router.push('/withdraw')
                    toast.success("Withdraw added Successfully!", { id: loadingPromise })
                },
                onError: (e) => {
                    toast.error("Fail to create Withdraw", { id: loadingPromise })
                },
            })
        }
    }

    if (creatWithdraw.isError) return <pre>{JSON.stringify(creatWithdraw.error, null, 2)}</pre>
    return (
        <section className='container'>
            <Overlay isLoading={creatWithdraw.isPending} />
            <div className="title">New Withdraw</div>
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
                    label="Amount"
                    name='amount'
                    type='number'
                    value={values.amount}
                    error={errors?.amount}
                    onChange={handleChange}
                    onWheel={e=>e.target.blur()}
                    placeholder="Enter the amount"
                    required
                />

                <TextInput
                    label="Previous"
                    name='previous'
                    type='number'
                    value={values.previous}
                    error={errors?.previous}
                    onChange={handleChange}
                    onWheel={e=>e.target.blur()}
                    placeholder="Previous remaining amount"
                    required
                />

                <TextInput
                    label="Remaining"
                    name='remaining'
                    type='number'
                    value={values.remaining}
                    error={errors?.remaining}
                    onChange={handleChange}
                    onWheel={e=>e.target.blur()}
                    placeholder="Enter the Remaining amount"
                    required
                />

                <TextInput
                    label='Bank Account'
                    name='bank_account'
                    type='text'
                    value={values.bank_account}
                    error={errors?.bank_account}
                    onChange={handleChange}
                    placeholder="Enter the Name"
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