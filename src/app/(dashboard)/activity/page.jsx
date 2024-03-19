'use client'

import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { GetAllActiviies } from '../../../../action/api'
import ReactTable from '@/components/ReactTable'

export default function ActivityPage() {

  const [data, setData] = useState([])
  const getTableData = useCallback(async ({ page, limit }) => {
    let res = await GetAllActiviies({ page: page, limit })
    setData(res)
  }, [])


  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'projectId',
      },
      {
        Header: 'Transaction Name',
        accessor: 'name',
      },
      // {
      //     Header: 'Details',
      //     accessor: 'transaction.details',
      // },
      {
        Header: 'Date',
        accessor: (cell) => <span>{dayjs(cell.date).format('DD MMM YYYY, hh:mm A')}</span>,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
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
        <ReactTable data={data} getTableData={getTableData} db='activity' columns={columns} />
      </div>
    </>
  )
}
