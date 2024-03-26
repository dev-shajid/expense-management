'use client'

import { useUserContext } from '@/context/ContextProvider';
import { Space, Table } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print';


export default function InvoiceDesign() {
    const { invoice_items, dispatch } = useUserContext()
    const InvoiceRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => InvoiceRef.current,
    });

    return (
        <div className='max-w-[700px] w-full flex flex-col gap-4'>
            <div onClick={handlePrint} className="add_button">Print Invoice</div>
            <div className='border border-gray-300 rounded-md overflow-x-auto'>
                <div ref={InvoiceRef} className='p-12 text-sm mx-auto space-y-4 min-w-[600px] !aspect-[210/297]'>
                    <div className='flex justify-between items-start'>
                        <div className="text-4xl font-semibold">Invoice</div>
                        <div className='text-right'>
                            <div className='text-xl font-medium'>{invoice_items?.bill?.own_company_name || 'Your Company Name'}</div>
                            <div className='text-sm'>{invoice_items?.bill?.own_address || 'Your Business Address'}</div>
                            <div className='text-sm'>{invoice_items?.bill?.own_email || 'Email'}</div>
                            <div className='text-sm'>{invoice_items?.bill?.own_phone || 'Phone'}</div>
                        </div>
                    </div>
                    <hr />
                    <div className='flex justify-between items-start'>
                        <div className='text-left'>
                            <div className='text-sm font-bold'>Bill To:</div>
                            <div className='text-xl font-medium'>{invoice_items?.bill?.company_name || 'Company Name'}</div>
                            <div className='text-sm'>{invoice_items?.bill?.address || 'Your Business Address'}</div>
                            <div className='text-sm'>{invoice_items?.bill?.email || 'Email'}</div>
                            <div className='text-sm'>{invoice_items?.bill?.phone || 'Phone'}</div>
                        </div>
                        <div className='text-right'>
                            {/* <div className='text-sm'>INVOICE NO: #12032</div> */}
                            <div className='text-sm'>Date: {dayjs(new Date()).format('DD MMM, YYYY - hh:MM A')}</div>
                        </div>
                    </div>
                    <Table withTableBorder withColumnBorders withRowBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Item</Table.Th>
                                <Table.Th className='!text-center'>Quantity</Table.Th>
                                <Table.Th className='!text-center'>Price</Table.Th>
                                <Table.Th className='!text-end'>Amount</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                invoice_items?.items?.map((item, i) => (
                                    <Table.Tr key={i}>
                                        <Table.Td>{item?.item}</Table.Td>
                                        <Table.Td className='text-center'>{item?.quantity}</Table.Td>
                                        <Table.Td className='text-center'>৳ {item?.price}</Table.Td>
                                        <Table.Td className='text-end'>৳ {item?.quantity * item?.price}</Table.Td>
                                    </Table.Tr>
                                ))
                            }
                        </Table.Tbody>
                    </Table>
                    {/* <Space h="10" /> */}
                    <Table>
                        <Table.Tbody className='text-base font-medium'>
                            {
                                invoice_items?.bill?.discount ?
                                    <>
                                        <Table.Tr>
                                            <Table.Td colSpan={3}>Subtotal</Table.Td>
                                            <Table.Td className='text-end'>৳ {invoice_items?.bill?.total}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td colSpan={3}>Discount ({invoice_items?.bill?.discount}%)</Table.Td>
                                            <Table.Td className='text-end'>-৳ {((invoice_items?.bill?.total * invoice_items?.bill?.discount) / 100)}</Table.Td>
                                        </Table.Tr>
                                    </> : null
                            }
                            <Table.Tr className='text-xl font-semibold'>
                                <Table.Td colSpan={3}>Total</Table.Td>
                                <Table.Td className='text-end'>৳ {invoice_items?.bill?.total - (invoice_items?.bill?.discount>0 ? ((invoice_items?.bill?.total * invoice_items?.bill?.discount) / 100) : 0)}</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
