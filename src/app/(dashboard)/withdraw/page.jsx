'use client'

import Link from 'next/link'
import useApi from '@/lib/useApi'
import ReactTable from '@/components/ReactTable'
import { GetAllWithdraws } from '../../../../action/api'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi'
import Overlay from '@/components/Overlay'

export default function TransactionsPage() {
  const { deleteWithdraw } = useApi()

  async function handleDelete(id) {
    let loadingPromise = toast.loading("Loading...")
    deleteWithdraw.mutate({ id }, {
      onSuccess: () => {
        toast.success("Deleted Withdraw!", { id: loadingPromise })
      },
      onError: (e) => {
        console.log(e)
        toast.error(e?.message || "Fail to delete Withdraw", { id: loadingPromise })
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
        Header: 'Bank',
        accessor: (cell) => <Link href={`/withdraw/${cell.id}`}>{cell.bank_account}</Link>,
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
        Header: 'Previous',
        accessor: 'previous',
      },
      {
        Header: 'Remaining',
        accessor: 'remaining',
      },
      {
        Header: 'Details',
        accessor: 'details',
      },
      {
        Header: 'Action',
        accessor: (cell) => {
          return (
            <div className='flex gap-3 justify-center items-center'>
              <Link href={`/withdraw/edit/${cell.id}`}>
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

  const getTableData = async ({ page = 0, limit = 10 }) => await GetAllWithdraws({ page, limit })

  return (
    <>
      <Overlay isLoading={deleteWithdraw.isPending}/>
      <div className="title">All Withdraw</div>
      <div className='mt-6'>
        <Link href={'/withdraw/addnew'} className="add_button">Add Withdraw</Link>
        <ReactTable getTableData={getTableData} db='withdraw' columns={columns} />
      </div>
    </>
  )
}
