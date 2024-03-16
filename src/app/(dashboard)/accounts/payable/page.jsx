'use client'

import TransactionTable from '../ACTransactionTable'
import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'

export default function AcReceivablePage() {
  const { getAllTransactions, getBasicInfo } = useApi()
  let { data, isError, error, isLoading } = getAllTransactions({ isPaid: false, type: 'expense' })
  let { data: basicInfo, isLoading: basicInfoLoading } = getBasicInfo()

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading || basicInfoLoading) return <Loading page />

  return (
    <div className='space-y-6'>
      <div className='flex flex-col text-center justify-center items-center gap-1 max-w-fit bg-white rounded-md p-4 border'>
        <span className='text'>A/C Payable</span>
        <span className='text-xl font-semibold'>{basicInfo?.payable} TK</span>
      </div>

      <div className="title">All Transaction</div>
      <div className='mt-6'>
        <Link href={'/accounts/payable/addnew'} className="add_button">Add Transaction</Link>
        <TransactionTable data={data} />
      </div>
    </div>
  )
}
