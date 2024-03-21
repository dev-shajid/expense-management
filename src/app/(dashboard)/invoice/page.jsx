'use client'

import Submit from '@/components/Submit'
import { useUserContext } from '@/context/ContextProvider'
import { NumberInput, Space, TextInput } from '@mantine/core'
import Link from 'next/link'
import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx'

export default function InvoicePage() {
  const { dispatch } = useUserContext()
  const [values, setValues] = useState({ own_company_name: '', own_address: '', own_email: '', own_phone: '', company_name: '', address: '', email: '', phone: '', discount: '' })
  const [items, setItems] = useState([{ item: '', quantity: undefined, price: undefined }])

  function handleChange(e) {
    setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
  }

  function handleItemChange(value, index, name) {
    const list = [...items];
    list[index][name] = value;
    setItems(list);
  }

  return (
    <div className='space-y-6'>
      <div className="title">Create Invoice</div>
      <div className='space-y-4'>
        <div className='bg-gray-s100 rounded-md space-y-8 border border-gray-300 p-4 sm:p-6'>
          <div className='space-y-4'>
            <div className="font-semibold text-xl">Your Details:</div>
            <div className='flex flex-col gap-4'>
              <TextInput
                label="Company Name"
                name='company_name'
                type='text'
                value={values?.company_name}
                onChange={handleChange}
                placeholder="Enter Company Name"
              />
              <TextInput
                label="Business Address"
                name='address'
                type='text'
                value={values?.address}
                onChange={handleChange}
                placeholder="Enter Company Address"
              />
              <TextInput
                label="Email"
                name='email'
                type='text'
                value={values?.email}
                onChange={handleChange}
                placeholder="Enter Company Email"
              />
              <TextInput
                label="Phone"
                name='phone'
                type='text'
                value={values?.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>
          </div>
          <Space h={1} />

          <div className='space-y-4'>
            <div className="font-semibold text-xl">Bill To:</div>
            <div className='flex flex-col gap-4'>
              <TextInput
                label="Company Name"
                name='company_name'
                type='text'
                value={values?.company_name}
                onChange={handleChange}
                placeholder="Enter Company Name"
              />
              <TextInput
                label="Business Address"
                name='address'
                type='text'
                value={values?.address}
                onChange={handleChange}
                placeholder="Enter Company Address"
              />
              <TextInput
                label="Email"
                name='email'
                type='text'
                value={values?.email}
                onChange={handleChange}
                placeholder="Enter Company Email"
              />
              <TextInput
                label="Phone"
                name='phone'
                type='text'
                value={values?.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>
          </div>
          <Space h={1} />

          <div className='space-y-3'>
            {
              items?.map((item, i) => (
                <div key={i} className='space-y-4 bg-white border p-4 rounded-md'>
                  <div className='flex justify-between gap4'>
                    <div className="font-semibold text-xl">Item-{i + 1}:</div>
                    {i ?
                      <RxCross1
                        onClick={() => {
                          let newItems = [...items]
                          newItems.splice(i, 1);
                          setItems(newItems)
                        }}
                        className='cursor-pointer'
                      />
                      : null}
                  </div>
                  <div className='flex flex-col gap-4'>
                    <TextInput
                      label="Item Name"
                      name='item'
                      type='text'
                      value={item?.item}
                      onChange={(e) => handleItemChange(e.target.value, i, 'item')}
                      placeholder="Enter Item Name"
                    />
                    <NumberInput
                      min={0}
                      label="Quantity"
                      name='quantity'
                      type='text'
                      value={item?.quantity}
                      onChange={(e) => handleItemChange(Number(e), i, 'quantity')}
                      placeholder="Enter Item's Quantity"
                    />
                    <NumberInput
                      label="Price"
                      name='price'
                      type='text'
                      value={item?.price}
                      onChange={(e) => handleItemChange(Number(e), i, 'price')}
                      placeholder="Enter Item's Price"
                    />
                  </div>
                </div>
              ))
            }
            <div
              onClick={() => {
                setItems(pre => [...pre, { item: '', quantity: '', price: '' }])
              }}
              className='underline cursor-pointer text-blue-600 pl-2'
            >
              Add Item
            </div>
          </div>

          <NumberInput
            min={0}
            label="Discount (Optional)"
            name='discount'
            type='text'
            value={values?.discount}
            onChange={(e) => setValues(pre => ({ ...pre, discount: Number(e) }))}
            placeholder="Enter Discount in % if any"
          />
        </div>
        <Link href='/invoice/view'><Submit onClick={() => {
          let t = 0
          items.forEach(e => t += Number(e.price) * Number(e.quantity))
          console.log(t)
          dispatch({ type: 'ADD_INVOICE', payload: { bill: { ...values, total: t }, items } })
        }} value="Preview" /></Link>
      </div>
    </div >
  )
}
