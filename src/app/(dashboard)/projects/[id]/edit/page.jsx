'use client'

import React, { useEffect, useState } from 'react'
import Submit from '@/components/Submit';
import { validateAddProjectForm } from '@/helper/validate';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useApi from '@/lib/useApi';
import Overlay from '@/components/Overlay';
import { TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import Loading from '@/components/Loading';

export default function EditProduct({ params }) {
    const [values, setValues] = useState({ name: '', date: null, budget: '', details: '' })
    const [errors, setErrors] = useState({})
    const router = useRouter()
    const { editProject, getProject } = useApi()

    const { data, isLoading, isError, error } = getProject({ id: params.id })

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
            editProject.mutate({ id: params.id, values }, {
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

    useEffect(() => {
        if (data?.name) {
            setValues({ name: data.name, date: data.start, budget: data.budget, details: data.details })
        }
    }, [data])

    if (editProject.isError) return <pre>{JSON.stringify(editProject.error, null, 2)}</pre>
    if (isLoading) return <Loading page />
    if (isError) return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
    return (
        <section className='container'>
            <Overlay isLoading={editProject?.isPending} />
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

                <TextInput
                    label='Budget'
                    name='budget'
                    type='number'
                    min={0}
                    value={values.budget}
                    error={errors?.budget}
                    onChange={handleChange}
                    onWheel={e => e.target.blur()}
                    placeholder="Enter Your Project Budget"
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
