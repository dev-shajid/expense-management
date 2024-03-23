'use client'

import React, { useState } from 'react'
import dayjs from 'dayjs';
import Submit from '@/components/Submit';
import { validateAddProjectForm } from '@/helper/validate';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { NumberInput, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';

export default function AddNewProduct() {
    const [values, setValues] = useState({ name: '', date: null, budget: '', details: '' })
    const [errors, setErrors] = useState({})
    const router = useRouter()
    const { creatProject } = useApi()

    function handleChange(e) {
        setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let d = await validateAddProjectForm(values)
        setErrors(d)
        if (!Object.keys(d).length) {
            // alert(JSON.stringify(values,null,2))
            let loadingPromise = toast.loading("Loading...")
            creatProject.mutate(values, {
                onSuccess: () => {
                    // router.refresh();
                    router.push('/projects')
                    toast.success("Project added Successfully!", { id: loadingPromise })
                },
                onError: (e) => {
                    toast.error("Fail to create Project", { id: loadingPromise })
                },
            })
        }
    }

    if (creatProject.isError) return <pre>{JSON.stringify(creatProject.error, null, 2)}</pre>
    return (
        <section className='container'>
            <Overlay isLoading={creatProject?.isPending} />
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
                />

                <TextInput
                    label="Name"
                    name='name'
                    type='text'
                    value={values.name}
                    error={errors?.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                />

                <NumberInput
                    label='Budget'
                    name='budget'
                    min={0}
                    value={values.budget}
                    error={errors?.budget}
                    thousandSeparator
                    onChange={(e) => setValues(pre => ({ ...pre, budget: e }))}
                    onWheel={e => e.target.blur()}
                    placeholder="Enter Your Project Budget"
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
