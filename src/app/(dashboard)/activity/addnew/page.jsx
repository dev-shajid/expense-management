'use client'

import { Autocomplete, Backdrop, Button, FormControl, FormHelperText, InputLabel, MenuItem, NativeSelect, OutlinedInput, Select, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import Submit from '@/components/Submit';
import { validateAddTransactionForm } from '@/helper/validate';
import { AddProject, AddTransaction, GetAllProjectsTitle } from '../../../../../action/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AddNewTransaction() {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({ name: '', date: undefined, amount: '', source: '', details: '', type: '', projectId: '' })
    const [errors, setErrors] = useState({})
    const [projectNames, setProjectNames] = useState([])
    const router = useRouter()

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
            try {
                setIsLoading(true)
                let res = await AddTransaction(values)
                // router.refresh();
                // router.push('/transactions')
                toast.success("Transaction Successful!", { id: loadingPromise })
            } catch (error) {
                toast.error("Some error arised", { id: loadingPromise })
            } finally {
                setIsLoading(false)
            }
        }
    }

    async function getProjectNames() {
        let arr = await GetAllProjectsTitle()
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
                        defaultValue={values.date}
                        format='DD/MM/YYYY'
                        slotProps={{
                            textField: {
                                helperText: "Enter Project Date",
                                error: errors?.date?.length && true,
                            },
                        }}
                        onChange={(e) => setValues((pre) => ({ ...pre, date: dayjs(e) }))}
                    />
                </LocalizationProvider>
                <FormControl required fullWidth error={errors?.type && true}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        value={values.type}
                        name='type'
                        onChange={handleChange}
                        label="Type"
                    >
                        <MenuItem value='income'>Income</MenuItem>
                        <MenuItem value='expanse'>Expanse</MenuItem>
                    </Select>
                    <FormHelperText>Select Transaction Type</FormHelperText>
                </FormControl>
                <Autocomplete
                    fullWidth
                    options={projectNames}
                    name="projectId"
                    onChange={(e, v) => setValues(p => ({ ...p, projectId: v.value }))}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"Project"}
                            inputProps={{
                                ...params.inputProps,
                            }}
                            required={true}
                            helperText="Select Your Project"
                        />
                    )}
                // error={values.project.length && true}
                />
                <TextField
                    label='Name'
                    name='name'
                    type='text'
                    required
                    value={values.name}
                    error={errors?.name?.length && true}
                    helperText={"Enter Your Name"}
                    onChange={handleChange}
                />
                <TextField
                    label='Source'
                    name='source'
                    type='text'
                    required
                    value={values.source}
                    error={errors?.source?.length && true}
                    helperText={"Enter the Source"}
                    onChange={handleChange}
                />
                <TextField
                    label='Amount'
                    name='amount'
                    type='number'
                    required
                    value={values.amount}
                    error={errors?.amount?.length && true}
                    helperText={"Enter the Amount"}
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
