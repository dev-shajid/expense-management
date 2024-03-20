'use client'

import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs';
import useApi from '@/lib/useApi';
import Loading from '@/components/Loading';
import { ActionIcon, Menu } from '@mantine/core';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ReactTable from '@/components/ReactTable';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { GetAllTransactions, GetCSVData } from '../../../../../action/api';

export default function ProjectPage({ params }) {
  const { getProject, deleteTransaction, editProject } = useApi()
  const { data: project, isLoading } = getProject({ id: params.id })

  let query = { projectId: params.id, isPaid: true }
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
        Header: 'Name',
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
        Header: 'Source',
        accessor: 'source',
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
              <Link href={`/transactions/edit/${cell.id}?redirect=/projects/${params?.id}`}>
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
    const res = await GetCSVData('transaction', query)
    setCsvData(res.map(p => ({ ID: p.id, Name: p.name, Details: p.details, Date: dayjs(p?.date || p?.since).format('DD MMM YYYY, hh:mm A'), Amount: p.amount, Type: p.type, Source: p.source })))
    setTimeout(() => {
      csvRef.current.link.click()
    }, 1000)
  }


  if (isLoading) return <Loading page />
  if (!project?.name) return <div className='text-center font-medium text-2xl text-gray-400 select-none'>No Project is Found!</div>

  const rows = [
    { title: "Date", value: dayjs(project.start).format('D MMM YYYY') },
    { title: "Budget", value: project.budget },
    { title: "Income", value: project.income },
    { title: "Expense", value: project.expense },
    { title: "Status", value: project.status },
    { title: "A/C Payable", value: project.payable },
    { title: "A/C Receivable", value: project.receivable },
  ]

  return (
    <section className='container'>
      <div className='flex justify-between items-center gap-4'>
        <div className="title">{project.name}</div>
        <>
          <Menu width={200} shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="transparent"
                size='sm'
                color="#000"
                className="!bg-inherit"
              >
                <HiOutlineDotsVertical size={20} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Link href={`/projects/${params.id}/edit`}>
                <Menu.Item>
                  Edit Project
                </Menu.Item>
              </Link>
              <Menu.Item
                onClick={() => {
                  let loadingPromise = toast.loading("Loading...")
                  editProject.mutate({ id: project.id, values: { status: project.status == 'End' ? 'On Going' : 'End' } }, {
                    onSuccess: (res) => {
                      if (res.success) toast.success("Project Updated!", { id: loadingPromise })
                    },
                    onError: (e) => {
                      console.log(e)
                      toast.error(e?.message || "Something is wrong!", { id: loadingPromise })
                    },
                  })
                }}
              >
                {project.status == 'End' ? 'On Going' : 'End'} Project
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                onClick={() => {
                  let loadingPromise = toast.loading("Loading...")
                  deleteUser.mutate({ id: project.id }, {
                    onSuccess: () => {
                      toast.success("Deleted Successfully!", { id: loadingPromise })
                    },
                    onError: (e) => {
                      console.log(e)
                      toast.error(e?.message || "Something is wrong!", { id: loadingPromise })
                    },
                  })
                }}
              >
                Delete Project
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </>
      </div>
      <div className='grid gap-4 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2'>
        {
          rows.map((p, i) => {
            if (p.title == 'A/C Payable' || p.title == 'A/C Receivable') {
              return <Link key={i} href={p.title == 'A/C Payable' ? `/accounts/payable?redirect=/projects/${project?.id}` : `/accounts/receivable?redirect=/projects/${project?.id}`}>
                <div className='flex flex-col text-center justify-center items-center gap-1 bg-white rounded-md p-4 border'>
                  <span className='text-xs'>{p.title}</span>
                  <span className='text font-semibold min-w-fit'>{p.value}</span>
                </div>
              </Link>
            }
            else {
              return <div key={i} className='flex flex-col text-center justify-center items-center gap-1 bg-white rounded-md p-4 border'>
                <span className='text-xs'>{p.title}</span>
                <span className='text font-semibold min-w-fit'>{p.value}</span>
              </div>
            }
          })
        }
      </div>
      {project.details ? <div className='grid gap-1 mt-4 bg-white rounded-md p-4 border'>
        <span className='text-xs text-gray-500'>Project Details</span>
        <span className='text-sm'>{project.details}</span>
      </div> : null}


      <div className='mt-8'>
        <div className="font-semibold text">All Transactions</div>
        <ReactTable getTableData={getTableData} db='transaction' columns={columns} query={query} csvData={csvData} handleCSVExport={handleCSVExport} />
      </div>

    </section>
  )
}