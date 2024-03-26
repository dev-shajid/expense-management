'use client'

import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FiEdit } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { GetAllTransactions } from '../../../../../action/api'
import ReactTable from '@/components/ReactTable'
import { ActionIcon, NumberFormatter, Popover } from '@mantine/core'
import { FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AcReceivablePage() {
  const params = useSearchParams()
  let path = usePathname()

  let redId = params.get('redirect')?.split('/')[2]

  const { getBasicInfo, getProject, deleteTransaction, editTransaction } = useApi()

  let query = { isPaid: false, type: 'income' }

  if (redId) query.projectId = redId
  let { data: basicInfo, isLoading: basicInfoLoading } = getBasicInfo()
  let projectDetails = redId ? getProject({ id: redId }) : null

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
        Header: 'Update',
        accessor: (cell) => {
          return <>
            <ActionIcon
              variant="light"
              color="indigo"
              size="sm"
              onClick={() => {
                let loadingPromise = toast.loading("Loading...")
                editTransaction.mutate({ id: cell.id, data: { isPaid: true, projectId: cell.projectId } }, {
                  onSuccess: (res) => {
                    if (res.success) {
                      toast.success("Updated Transaction Successfully!", { id: loadingPromise })
                    }
                    else throw new Error(res.error)
                  },
                  onError: (e) => {
                    console.log(e)
                    toast.error(e?.message || "Something is wrong!", { id: loadingPromise })
                  },
                })
              }}
            >
              <FaCheck size={14} />
            </ActionIcon>
          </>
        }
      },
      {
        Header: 'Id',
        accessor: 'id',
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
      {
        Header: 'Date',
        accessor: (cell) => <span>{dayjs(cell.date)?.format('DD MMM YYYY')}, {dayjs(cell.createdAt)?.format('hh:mm A')}</span>,
      },
      {
        Header: 'Amount',
        accessor: (cell) => <>৳ <NumberFormatter thousandSeparator value={cell.amount} /></>,
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
              <Link href={`${path}/edit/${cell.id}`}>
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

  if (basicInfoLoading || projectDetails?.isLoading) return <Loading page />
  if (deleteTransaction.isError) return <pre>{JSON.stringify(deleteTransaction.error, null, 2)}</pre>

  return (
    <>
      <div className='space-y-6'>
        <div className='flex flex-col text-center justify-center items-center gap-1 max-w-fit bg-white rounded-md p-4 border'>
          <span className='text'>A/C Receivable</span>
          <span className='text-xl font-semibold'>৳ <NumberFormatter thousandSeparator value={projectDetails?.data?.receivable || basicInfo?.receivable} /></span>
        </div>

        <div className='mt-6 space-y-4'>
          <Link href={'/accounts/receivable/addnew'} className="add_button">Add Transaction</Link>
          <div className="font-semibold text-xl">All Transactions</div>
          <ReactTable getTableData={getTableData} db='transaction' columns={columns} query={query} />
        </div>
      </div>
    </>
  )
}
