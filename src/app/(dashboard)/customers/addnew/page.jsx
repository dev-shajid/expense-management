'use client'

import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import Submit from '@/components/Submit';
import { validateCustomerForm } from '@/helper/validate';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { DateInput } from '@mantine/dates';
import { TextInput, Textarea } from '@mantine/core';

export default function AddNewCustomer() {
    const [values, setValues] = useState({ name: '', email: '', phone: '', address: '', company: '', since: undefined, details: '', })
    const [errors, setErrors] = useState({})
    const [projectNames, setProjectNames] = useState([])
    const router = useRouter()
    const { addCustomer } = useApi()

    function handleChange(e) {
        setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let d = await validateCustomerForm(values)
        setErrors(d)
        // console.log(d)
        if (!Object.keys(d).length) {
            // alert(JSON.stringify(values, null, 2))
            let loadingPromise = toast.loading("Loading...")
            addCustomer.mutate(({ data: values }), {
                onSuccess: () => {
                    router.push('/customers')
                    toast.success("Customer added Successfully!", { id: loadingPromise })
                },
                onError: (e) => {
                    toast.error(e.error || "Fail to create Customer", { id: loadingPromise })
                },
            })
        }
    }

    if (addCustomer.isError) return <pre>{JSON.stringify(addCustomer.error, null, 2)}</pre>
    return (
        <section className='container'>
            <Overlay isLoading={addCustomer.isPending} />
            <div className="title">New Customer</div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <TextInput
                    label="Name"
                    name='name'
                    type='text'
                    value={values.name}
                    error={errors?.name}
                    onChange={handleChange}
                    placeholder="Enter Customers Name"
                />

                <TextInput
                    label="Email"
                    name='email'
                    type='text'
                    value={values.email}
                    error={errors?.email}
                    onChange={handleChange}
                    placeholder="Enter Customers Email"
                />

                <TextInput
                    label="Phone"
                    name='phone'
                    type='number'
                    value={values.phone}
                    error={errors?.phone}
                    onChange={handleChange}
                    placeholder="Enter Customers Phone"
                />

                <TextInput
                    label="Address"
                    name='address'
                    type='text'
                    value={values.address}
                    onChange={handleChange}
                    placeholder="Enter Customers Address"
                />

                <TextInput
                    label="Company"
                    name='company'
                    type='text'
                    value={values.company}
                    onChange={handleChange}
                    placeholder="Enter Customers Company Name"
                />

                <DateInput
                    maxDate={new Date()}
                    value={values?.since}
                    onChange={(e) => setValues((pre) => ({ ...pre, since: dayjs(e) }))}
                    label="Date"
                    placeholder="Customer Since"
                    name='date'
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