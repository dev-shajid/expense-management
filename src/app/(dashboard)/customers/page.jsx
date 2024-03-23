'use client'

import Link from 'next/link'
import useApi from '@/lib/useApi'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { GetCustomers } from '../../../../action/api'
import ReactTable from '@/components/ReactTable'
import { Popover } from '@mantine/core'

export default function CustomersPage() {
  const { deleteCustomer } = useApi()

  const getTableData = async ({ page = 0, limit = 10 }) => await GetCustomers({ page, limit })

  async function handleDelete(id) {
    let loadingPromise = toast.loading("Loading...")
    deleteCustomer.mutate({ id }, {
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
        Header: 'Name',
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
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Company',
        accessor: 'company',
      },
      {
        Header: 'Customer Since',
        accessor: (cell) => <span>{dayjs(cell.since)?.format('DD MMM YYYY')}</span>,
      },
      {
        Header: 'Action',
        accessor: (cell) => {
          return (
            <div className='flex gap-3 justify-center items-center'>
              <Link href={`/customers/edit/${cell.id}`}>
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

  return (
    <>
      <div className="title">Customers</div>
      <div className='mt-6'>
        <Link href={'/customers/addnew'} className="add_button">New Customer</Link>
        <ReactTable getTableData={getTableData} db='customer' columns={columns} />
      </div>
    </>
  )
}
