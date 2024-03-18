'use client'

import Overlay from '@/components/Overlay'
import Submit from '@/components/Submit'
import { useUserContext } from '@/context/ContextProvider'
import { validatePasswordForm, validateProfileForm } from '@/helper/validate'
import useApi from '@/lib/useApi'
import { PasswordInput, TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, dispatch } = useUserContext()
  const [values, setValues] = useState({ name: '', email: '', phone: '' })
  const [passwords, setPassword] = useState({ old_password: '', new_password: '' })
  const [errors, setErrors] = useState({})
  const [passwordsErrors, setPasswordsErrors] = useState({})
  const { editProfile, editPassword } = useApi()

  function handleChange(e) {
    setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
  }

  function handlePasswordChange(e) {
    setPassword((pre) => ({ ...pre, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let d = await validateProfileForm(values)
    setErrors(d)
    if (!Object.keys(d).length) {
      let loadingPromise = toast.loading("Loading...")
      editProfile.mutate(({ id: user.id, data: values }), {
        onSuccess: (res) => {
          console.log(res)
          dispatch({ type: 'ADD_USER', payload: res })
          toast.success("Profile Updated Successfully!", { id: loadingPromise })
        },
        onError: (e) => {
          toast.error(e.error || "Fail to update Profile", { id: loadingPromise })
        },
      })
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    let d = await validatePasswordForm(passwords)
    setPasswordsErrors(d)
    // console.log(d)
    if (!Object.keys(d).length) {
      // alert(JSON.stringify(values, null, 2))
      let loadingPromise = toast.loading("Loading...")
      editPassword.mutate(({ id: user.id, data: passwords }), {
        onSuccess: (res) => {
          console.log({ res })
          if (res.success) toast.success("Password Updated Successfully!", { id: loadingPromise })
          else throw new Error(res.message)
          setPassword({ old_password: '', new_password: '' })
        },
        onError: (error) => {
          // console.log({ error })
          toast.error(error.message || "Fail to update Password", { id: loadingPromise })
        },
      })
    }
  }

  useEffect(() => {
    if (user.name) setValues({ name: user.name, email: user.email, phone: user.phone || '' })
  }, [user])

  return (
    <>
      <Overlay isLoading={editProfile.isPending || editPassword.isPending} />
      <div className='space-y-6'>
        <div className='bg-gray-100 rounded-md border border-gray-300 p-4 sm:p-6'>
          <div className="title">Profile</div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
              value={values?.email}
              placeholder="Enter Your Email"
              readOnly
            />

            <TextInput
              label="Phone"
              name='phone'
              type='number'
              value={values?.phone}
              error={errors?.phone}
              onChange={handleChange}
              onWheel={e => e.target.blur()}
              placeholder="Enter Your Phone Number"
            />

            <Submit type='submit' value="Update Profile" />
          </form>
        </div>

        <div className='bg-gray-100 rounded-md border border-gray-300 p-4 sm:p-6'>
          <div className="title">Change Password</div>
          <form onSubmit={handlePasswordSubmit} className='flex flex-col gap-4'>
            <PasswordInput
              label="Old Password"
              name='old_password'
              value={passwords?.old_password}
              error={passwordsErrors?.old_password}
              onChange={handlePasswordChange}
              placeholder="Enter Old Password"
            />

            <PasswordInput
              label="New Password"
              name='new_password'
              value={passwords?.new_password}
              error={passwordsErrors?.new_password}
              onChange={handlePasswordChange}
              placeholder="Enter New Password"
            />

            <Submit type='submit' value="Update Password" />
          </form>
        </div>
      </div>
    </>
  )
}
