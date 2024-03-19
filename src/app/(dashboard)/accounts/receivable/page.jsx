'use client'

import TransactionTable from '../ACTransactionTable'
import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'

export default function AcReceivablePage({ searchParams: { redirect } }) {
  let red = redirect?.split('/')
  const { getAllTransactions, getBasicInfo, getProject } = useApi()
  let query = { isPaid: false, type: 'income' }
  if (red && red.length >= 2) query.projectId = red[2]
  let { data, isError, error, isLoading } = getAllTransactions(query)
  let { data: basicInfo, isLoading: basicInfoLoading } = getBasicInfo()
  let projectDetails = red ? getProject({ id: red[2] }) : null

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading || basicInfoLoading || projectDetails?.isLoading) return <Loading page />

  return (
    <div className='space-y-6'>
      <div className='flex flex-col text-center justify-center items-center gap-1 max-w-fit bg-white rounded-md p-4 border'>
        <span className='text'>A/C Receivalbe</span>
        <span className='text-xl font-semibold'>{projectDetails?.data?.receivable || basicInfo?.receivable} TK</span>
      </div>
      
      <div className='mt-6 space-y-4'>
        <Link href={'/accounts/receivable/addnew'} className="add_button">Add Transaction</Link>
        {
          data?.length ?
            <>
              <div className="font-semibold text-xl">All Transactions</div>
              <TransactionTable data={data} />
            </> :
            <div className='text-center font-medium text-2xl text-gray-400 select-none'>No Transaction!</div>
        }
      </div>
    </div>
  )
}
