'use client'

import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { GetAllTransactions } from '../../../../action/api'
import ReactTable from '@/components/ReactTable'
import toast from 'react-hot-toast'

export default function TransactionsPage() {
  const { deleteTransaction } = useApi()

  let query = { isPaid: true }
  const [data, setData] = useState([])
  const getTableData = useCallback(async ({ page = 0, limit = 10 }) => {
    let res = await GetAllTransactions(query, { page, limit })
    setData(res)
  }, [])

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
        accessor: (cell) => <span>{dayjs(cell.date)?.format('DD MMM YYYY, hh:mm A')}</span>,
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
              <Link href={`/transactions/edit/${cell.id}`}>
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

  // if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  // if (isLoading) return <Loading page />
  if (deleteTransaction.isError) return <pre>{JSON.stringify(deleteTransaction.error, null, 2)}</pre>

  return (
    <>
      <div className="title">All Transaction</div>
      <div className='mt-6'>
        <Link href={'/transactions/addnew'} className="add_button">Add Transaction</Link>
        <ReactTable data={data} getTableData={getTableData} db='transaction' columns={columns} query={query} />
      </div>
    </>
  )
}
