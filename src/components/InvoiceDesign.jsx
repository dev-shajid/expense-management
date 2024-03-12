'use client'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';


export default function InvoiceDesign() {
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
                            <div className='text-xl font-medium'>Your Company Name</div>
                            <div className='text-sm'>Your Business Address</div>
                            <div className='text-sm'>Email</div>
                            <div className='text-sm'>Phone</div>
                        </div>
                    </div>
                    <hr />
                    <div className='flex justify-between items-start'>
                        <div className='text-left'>
                            <div className='text-sm font-bold'>Bill To:</div>
                            <div className='text-xl font-medium'>Company Name</div>
                            <div className='text-sm'>Your Business Address</div>
                            <div className='text-sm'>Email</div>
                            <div className='text-sm'>Phone</div>
                        </div>
                        <div className='text-right'>
                            <div className='text-sm'>INVOICE NO: #12032</div>
                            <div className='text-sm'>Date: 12, April 2024</div>
                        </div>
                    </div>
                    <hr />
                    <table className='w-full bg-inherit invoice'>
                        <thead>
                            <tr className='!py-4'>
                                <th align='left'>Items</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th align='right'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [1, 2, 3, 4].map((e) => (
                                    <tr key={e} className='!py-4'>
                                        <td align='left'>{e}</td>
                                        <td align='center'>Description</td>
                                        <td align='center'>Quantity</td>
                                        <td align='center'>Price</td>
                                        <td align='right'>Amount</td>
                                    </tr>
                                ))
                            }
                            {/* <tr><td colSpan={5}><hr className='border-gray-400'/></td></tr> */}
                            <tr className='!h-[100px]'>
                                <td colSpan={4} className='!text-2xl border-[#f6f6f6]'> Total</td>
                                <td align='right' className='!text-2xl font-bold border-[#f6f6f6]'> 13700</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
