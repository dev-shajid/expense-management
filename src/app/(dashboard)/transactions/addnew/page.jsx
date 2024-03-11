'use client'

import { Autocomplete, Backdrop, Button, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import Submit from '@/components/Submit';
import { validateAddProjectForm } from '@/helper/validate';
import { AddProject } from '../../../../../action/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddNewProduct() {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({ name: 'Project 2', start: '14/3/2024', budget: '25000', details: 'Just a details' })
    const [errors, setErrors] = useState({})
    const [projectNames, setProjectNames] = useState([])
    const router = useRouter()

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
            try {
                setIsLoading(true)
                let res = await AddProject(values)
                router.refresh();
                router.push('/projects')
                toast.success("Project added Successfully!", { id: loadingPromise })
            } catch (error) {
                toast.error("Some error arised", { id: loadingPromise })
            } finally {
                setIsLoading(false)
            }
        }
    }

    async function getProjectNames() {
        let data = await fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json())
        let arr = data.map(e => ({ label: e.title, value: e }))
        setProjectNames(arr);
    }

    useEffect(() => {
        getProjectNames()
    }, [])

    return (
        <section className='container'>
            <Backdrop className='backdrop' open={isLoading} />
            <div className="title">New Projects</div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        minDate={dayjs(new Date())}
                        helperText="Hello"
                        label="Date"
                        defaultValue={values.start}
                        slotProps={{
                            textField: {
                                helperText: "Enter Project Date",
                                error: errors?.start?.length && true,
                            },
                        }}
                        onChange={(e) => setValues((pre) => ({ ...pre, start: dayjs(e).format('DD/MM/YYYY') }))}
                    />
                </LocalizationProvider>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={projectNames}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Movie" />}
                />
                <TextField
                    label='Name'
                    name='name'
                    type='text'
                    value={values.name}
                    error={errors?.name?.length && true}
                    helperText={"Enter Your Name"}
                    onChange={handleChange}
                />
                <TextField
                    label='Budget'
                    name='budget'
                    type='number'
                    value={values.budget}
                    error={errors?.budget?.length && true}
                    helperText={"Enter Your Project Budget"}
                    onChange={handleChange}
                />
                <TextField
                    label='Project Details'
                    fullWidth
                    multiline
                    value={values.details}
                    minRows={10}
                    helperText={"Enter some details"}
                    onChange={handleChange}
                    name='details'
                />
                <Submit />
            </form>
        </section>
    )
}
