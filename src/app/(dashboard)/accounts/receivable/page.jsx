'use client'

import TransactionTable from '../ACTransactionTable'
import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'

export default function AcPayablePage() {
  const { getAllTransactions, getBasicInfo } = useApi()
  let { data, isError, error, isLoading } = getAllTransactions({ isPaid: false, type: 'income' })
  let { data: basicInfo, isLoading: basicInfoLoading } = getBasicInfo()
  // console.log(data)

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading || basicInfoLoading) return <Loading page />

  return (
    <div className='space-y-6'>
      <div className='flex flex-col text-center justify-center items-center gap-1 max-w-fit bg-white rounded-md p-4 border'>
        <span className='text'>A/C Receivalbe</span>
        <span className='text-xl font-semibold'>{basicInfo?.receivable} TK</span>
      </div>

      <div className="title">All Transaction</div>
      <div className='mt-6'>
        <Link href={'/accounts/receivable/addnew'} className="add_button">Add Transaction</Link>
        {
          data?.length ?
            <>
              <div className="font-semibold text">All Transactions</div>
              <TransactionTable data={data} />
            </> :
            <div className='text-center font-medium text-2xl text-gray-400 select-none'>No Transaction!</div>
        }
      </div>
    </div>
  )
}
