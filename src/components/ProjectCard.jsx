import dayjs from 'dayjs'
import React from 'react'

export default function ProjectCard({project}) {
    return (
        <div className='flex border shadow-sm sm:hover:shadow-lg duration-100 flex-col justify-between p-4 rounded-md space-y-8 cursor-pointer bg-white'>
            <div className='space-y-4'>
                <div className='sm:text-xl text-base text-center font-medium'>{project.name}</div>
                <div className='grid gap-3 text-s'>
                    <div className='flex items-center justify-between'>
                        <p className='bg-green-300 rounded-md text-center w-[130px] py-1'>Total Income</p>
                        <p className='text text-green-700 font-semibold'>৳ {project.total_income}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='bg-red-300 rounded-md text-center w-[130px] py-1'>Total Expense</p>
                        <p className='text text-red-500 font-semibold'>৳ {project.total_expense}</p>
                    </div>
                </div>
            </div>
            <div className='flex justify-between text-xs items-center'>
                <div>Started on: {dayjs(project.start).format('DD-MMM-YYYY')}</div>
                <div className='border border-gray-300 min-w-[80px] text-center rounded-full px-3 py-1 bg-gray-200'>{project.status}</div>
            </div>
        </div>
    )
}
