'use client'

import TransactionTable from './TransactionTable'
import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'

export default async function TransactionsPage() {
  const { getAllTransactions } = useApi()
  let { data, isError, error, isLoading } = getAllTransactions

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading) return <Loading page />

  return (
    <>
      <div className="title">All Transaction</div>
      <div className='mt-8 space-y-4'>
        <Link href={'/transactions/addnew'} className="add_button">Add Transaction</Link>
        <TransactionTable data={data} />
      </div>
    </>
  )
}
