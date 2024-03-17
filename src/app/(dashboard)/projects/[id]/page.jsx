'use client'

import React from 'react'
import ProjectTransactionTable from './ProjectTransactionTable';
import dayjs from 'dayjs';
import useApi from '@/lib/useApi';
import Loading from '@/components/Loading';
import { ActionIcon, Menu } from '@mantine/core';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProjectPage({ params }) {
  const { getProject, getAllTransactions, editProject } = useApi()
  const { data: project, isLoading } = getProject({ id: params.id })
  const { data, isLoading: dataLoading } = getAllTransactions({ projectId: params.id })

  if (isLoading || dataLoading) return <Loading page />
  if (!project) return <div className='text-center font-medium text-2xl text-gray-400 select-none'>No Project is Found!</div>

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
                      if(res.success) toast.success("Project Updated!", { id: loadingPromise })
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
          rows.map((p, i) => (
            <div key={i} className='flex flex-col text-center justify-center items-center gap-1 bg-white rounded-md p-4 border'>
              <span className='text-xs'>{p.title}</span>
              <span className='text font-semibold min-w-fit'>{p.value}</span>
            </div>
          ))
        }
      </div>
      {project.details ? <div className='grid gap-1 mt-4 bg-white rounded-md p-4 border'>
        <span className='text-xs text-gray-500'>Project Details</span>
        <span className='text-sm'>{project.details}</span>
      </div> : null}


      <div className='mt-8'>
        {
          data?.length ?
            <>
              <div className="font-semibold text">All Transactions</div>
              <ProjectTransactionTable data={data} />
            </> :
            <div className='text-center font-medium text-2xl text-gray-400 select-none'>No Transaction!</div>
        }
      </div>

    </section>
  )
}