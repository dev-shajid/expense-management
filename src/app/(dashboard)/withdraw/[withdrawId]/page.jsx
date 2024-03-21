'use client'

import Link from 'next/link'
import useApi from '@/lib/useApi'
import dayjs from 'dayjs'
import { GetAllTransactions } from '../../../../../action/api'
import ReactTable from '@/components/ReactTable'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

export default function WithdrawPage({ params }) {
  const { deleteTransaction, getWithdraw } = useApi()

  let { data: withdraw, isLoading: withdrawIsLoading, isError: withdrawIsError, error: withdrawError } = getWithdraw({ id: params.withdrawId })

  let query = {}
  if (params?.withdrawId) query.withdrawId = params.withdrawId
  const getTableData = async ({ page = 0, limit = 10 }) => await GetAllTransactions(query, { page, limit })

  async function handleDelete(id) {
    let loadingPromise = toast.loading("Loading...")
    deleteTransaction.mutate(id, {
      onSuccess: () => {
        toast.success("Deleted Transaction!", { id: loadingPromise })
      },
      onError: (e) => {
        console.log(e)
        toast.error(e?.message || "Fail to delete Transaction", { id: loadingPromise })
      },
    })
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
      },
      {
        Header: 'Transaction Name',
        accessor: 'name',
      },
      {
        Header: 'Date',
        accessor: (cell) => <span>{dayjs(cell.date)?.format('DD MMM YYYY')}, {dayjs(cell.createdAt)?.format('hh:mm A')}</span>,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Project',
        accessor: 'project.name',
      },
      {
        Header: 'Type',
        accessor: (cell) => <p className={`${cell.type == 'income' ? 'bg-green-500' : 'bg-red-400'} font-medium text-white text-center inline-block capitalize rounded-full px-4`}>{cell.type}</p>
      },
      {
        Header: 'Action',
        accessor: (cell) => {
          return (
            <div className='flex gap-3 justify-center items-center'>
              <Link href={`/transactions/edit/${cell.id}?redirect=/withdraw/${params.withdrawId}`}>
                <FiEdit
                  size={18}
                  cursor='pointer'
                />
              </Link>
              <AiOutlineDelete
                size={20}
                cursor='pointer'
                onClick={() => handleDelete(cell.id)}
              />
            </div>
          )
        }
      },
    ],
    [])

  const rows = [
    { title: "Date", value: dayjs(withdraw?.start).format('D MMM YYYY') },
    { title: "Bank Account", value: withdraw?.bank_account },
    { title: "Amount", value: withdraw?.amount },
    { title: "Previous", value: withdraw?.previous },
    { title: "Remaining", value: withdraw?.remaining },
  ]

  return (
    <section className='container'>
      <div className='grid gap-4 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2'>
        {
          rows.map((p, i) => (
            <div key={i} className='flex flex-col text-center justify-center items-center gap-1 bg-white rounded-md p-4 border'>
              <span className='text-xs'>{p.title}</span>
              <span className='text font-semibold min-w-fit'>{p.value}</span>
            </div>
          ))
        }
      </div>
      {withdraw?.details ? <div className='grid gap-1 mt-4 bg-white rounded-md p-4 border'>
        <span className='text-xs text-gray-500'>Withdraw Details</span>
        <span className='text-sm'>{withdraw.details}</span>
      </div> : null}

      <div className='mt-8'>
        <div className="title">All Transaction</div>
        <div className='mt-6'>
          <Link href={`/withdraw/${params.withdrawId}/add_transaction`} className="add_button">Add Transaction</Link>
          <ReactTable getTableData={getTableData} db='transaction' columns={columns} query={query} />
        </div>
      </div>
    </section>
  )
}
