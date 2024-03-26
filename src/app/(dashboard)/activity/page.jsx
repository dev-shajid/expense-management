'use client'

import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { GetAllActiviies } from '../../../../action/api'
import ReactTable from '@/components/ReactTable'
import { NumberFormatter, Popover } from '@mantine/core'

export default function ActivityPage() {

  const getTableData = async (paginition) => await GetAllActiviies(paginition)

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'projectId',
      },
      {
        Header: 'Transaction Name',
        accessor: (cell) => (
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <span className='cursor-pointer'>{cell.name}</span>
            </Popover.Target>
            <Popover.Dropdown className='text-center'>
              {
                cell.details ?
                  <span className='text-sm'>{cell.details}</span> :
                  <span className='text-sm text-gray-400'>No Details!</span>
              }
            </Popover.Dropdown>
          </Popover>
        ),
      },
      // {
      //     Header: 'Details',
      //     accessor: 'transaction.details',
      // },
      {
        Header: 'Date',
        accessor: (cell) => <span>{dayjs(cell.createdAt).format('DD MMM YYYY, hh:mm A')}</span>,
      },
      {
        Header: 'Amount',
        accessor: (cell) => <>৳ <NumberFormatter thousandSeparator value={cell.amount} /></>,
      },
      {
        Header: 'Project',
        accessor: 'project',
      },
      {
        Header: 'Type',
        accessor: (cell) => <p className={`${cell.type == 'income' ? 'bg-green-500' : 'bg-red-400'} font-medium text-white text-center inline-block capitalize rounded-full px-4`}>{cell.type}</p>
      },
      {
        Header: 'Action',
        accessor: 'action',
      },
    ],
    [])

  return (
    <>
      <div className="title">All Activities</div>
      <div className='space-y-4'>
        <ReactTable getTableData={getTableData} db='activity' columns={columns} />
      </div>
    </>
  )
}
