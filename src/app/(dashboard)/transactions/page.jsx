'use client'

import TransactionTable from './TransactionTable'
import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'

export default function TransactionsPage() {
  const { getAllTransactions } = useApi()
  let { data, isError, error, isLoading } = getAllTransactions({ isPaid: true })

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading) return <Loading page />

  return (
    <>
      <div className="title">All Transaction</div>
      <div className='mt-6'>
        <Link href={'/transactions/addnew'} className="add_button">Add Transaction</Link>
        <TransactionTable data={data} />
      </div>
    </>
  )
}
