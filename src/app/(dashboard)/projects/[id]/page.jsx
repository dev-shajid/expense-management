import React from 'react'
import { GetProject, GetProjectsTransaction } from '../../../../../action/api'
import ProjectTransactionTable from './ProjectTransactionTable';
import dayjs from 'dayjs';


export default async function ProjectPage({ params }) {
  let project = await GetProject(params.id)
  let data = await GetProjectsTransaction(params.id)
  if (!project) return <>No Project is Found!</>

  const rows = [
    { title: "Date", value: dayjs(project.start).format('D MMM YYYY') },
    { title: "Budget", value: project.budget },
    { title: "Income", value: project.total_income },
    { title: "Expense", value: project.total_expense },
    { title: "Status", value: project.status },
    { title: "A/C Payable", value: project.payable },
    { title: "A/C Receivable", value: project.receivable },
  ]
  
  return (
    <section className='container'>
      <div className="title">{project.name}</div>
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


      <div className='mt-8 space-y-4'>
        {
          data.length ?
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