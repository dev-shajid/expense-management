'use client'

import Link from 'next/link'
import useApi from '@/lib/useApi'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { GetAllTransactions, GetCSVData } from '../../../../action/api'
import ReactTable from '@/components/ReactTable'
import toast from 'react-hot-toast'

export default function TransactionsPage() {
  const { deleteTransaction } = useApi()

  let query = { isPaid: true }
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

  const [csvData, setCsvData] = useState([])
  const handleCSVExport = async (csvRef) => {
    const res = await GetCSVData('transaction', query, { project: { select: { name: true, } } })
    setCsvData(res.map(p => ({ ID: p.id, Name: p.name, Project: p?.project.name, Details: p.details, Date: dayjs(p?.date || p?.since).format('DD MMM YYYY, hh:mm A'), Amount: p.amount, Type: p.type, Source: p.source })))
    setTimeout(() => {
      csvRef.current.link.click()
    }, 1000)
  }

  if (deleteTransaction.isError) return <pre>{JSON.stringify(deleteTransaction.error, null, 2)}</pre>

  return (
    <>
      <div className="title">All Transaction</div>
      <div className='mt-6'>
        <Link href={'/transactions/addnew'} className="add_button">Add Transaction</Link>
        <ReactTable getTableData={getTableData} db='transaction' columns={columns} query={query} csvData={csvData} handleCSVExport={handleCSVExport} />
      </div>
    </>
  )
}
