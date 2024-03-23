'use client'

import React, { useEffect, useState } from 'react'
import Submit from '@/components/Submit';
import { validateAddTransactionForm } from '@/helper/validate';
import { GetAllProjectsTitle } from '../../../../../../action/api';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { DateInput } from '@mantine/dates';
import { NumberInput, TextInput, Textarea } from '@mantine/core';
import Loading from '@/components/Loading';

export default function AddNewTransaction({ params }) {
    const [values, setValues] = useState({ date: undefined, amount: '', previous: '', bank_account: '', details: '' })
    const [errors, setErrors] = useState({})
    const [projectNames, setProjectNames] = useState([])
    const router = useRouter()
    const { editWithdraw, getWithdraw } = useApi()
    let { data, isError, error, isLoading } = getWithdraw({ id: params.id })

    function handleChange(e) {
        setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let d = await validateAddTransactionForm(values)
        setErrors(d)
        if (!Object.keys(d).length) {
            let loadingPromise = toast.loading("Loading...")
            editWithdraw.mutate({ id: params.id, data: values }, {
                onSuccess: (res) => {
                    if(res.success){
                        router.push('/withdraw')
                        toast.success("Updated Withdraw!", { id: loadingPromise })
                    }else throw new Error(res.message)
                },
                onError: (e) => {
                    console.log(e)
                    toast.error(e?.message || "Fail to update Withdraw", { id: loadingPromise })
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
        if (data) {
            setValues({ date: data.date, amount: data.amount, previous: data.previous, bank_account: data.bank_account, details: data.details })
        }
    }, [data])

    // if (editWithdraw.isError) return <pre>Error: {JSON.stringify(editWithdraw.error, null, 2)}</pre>
    // if (isError) return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
    if (isLoading) return <Loading page />
    return (
        <section className='container'>
            <Overlay isLoading={editWithdraw.isPending} />
            <div className="title">Edit Withdraw</div>
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

                <NumberInput
                    label="Amount"
                    name='amount'
                    value={values.amount}
                    error={errors?.amount}
                    thousandSeparator
                    onChange={(e) => setValues(pre => ({ ...pre, amount: e }))}
                    onWheel={e => e.target.blur()}
                    placeholder="Enter the amount"
                    required
                />

                <NumberInput
                    label="Previous"
                    name='previous'
                    value={values.previous}
                    error={errors?.previous}
                    thousandSeparator
                    onChange={(e) => setValues(pre => ({ ...pre, previous: e }))}
                    onWheel={e => e.target.blur()}
                    placeholder="Previous remaining amount"
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
                <Submit type='submit' />
            </form>
        </section>
    )
}
