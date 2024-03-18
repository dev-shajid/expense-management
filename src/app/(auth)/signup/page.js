'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { validateRegisterForm } from '@/helper/validate'
import Overlay from '@/components/Overlay'
import { PasswordInput, TextInput } from '@mantine/core'
import Submit from '@/components/Submit'

export default function page({ searchParams }) {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({ name: '', email: '', password: '' })
    const [errors, setErrors] = useState({})
    const router = useRouter()

    function handleChange(e) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let validation = await validateRegisterForm(values)
        setErrors(validation)

        if (!Object.keys(validation).length) {
            let loadingPromise = toast.loading("Loading...")
            try {
                setIsLoading(true)
                let res = await axios.post('/api/auth/register', values)
                // console.log(res.data)
                if (res.status == 200) {
                    router.push('/signin')
                    toast.success(res?.data.message || "Registration Successful!", { id: loadingPromise })
                }
            } catch (error) {
                console.log({ error })
                let res = error?.response?.data
                toast.error(res?.error || "Some error arised!", { id: loadingPromise })
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <>
            <Overlay isLoading={isLoading} />
            <section className="">
                <div className="flex flex-col items-center justify-center sm:px-6 px-2 py-8 mx-auto h-[90dvh] lg:py-0">
                    <div className="w-full bg-gray-100 rounded-lg border border-gray-300 max-w-[400px]">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Sign in to your account
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-2" action="#">
                                <TextInput
                                    label="Name"
                                    name='name'
                                    type='text'
                                    value={values?.name}
                                    error={errors?.name}
                                    onChange={handleChange}
                                    placeholder="Enter Your Name"
                                />
                                <TextInput
                                    label="Email"
                                    name='email'
                                    type='text'
                                    value={values?.email}
                                    error={errors?.email}
                                    onChange={handleChange}
                                    placeholder="Enter Your Email"
                                />
                                <PasswordInput
                                    label="Password"
                                    name='password'
                                    value={values?.password}
                                    error={errors?.password}
                                    onChange={handleChange}
                                    placeholder="Enter Your Password"
                                />

                                <Submit type='submit' loading={isLoading} className='w-full !mt-4'>Sign Up</Submit>
                                <p className="text-sm font-light text-gray-700">
                                    Don’t have an account yet? <Link href="/signin" className="font-medium text-blue-500 underline">Sign in</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}