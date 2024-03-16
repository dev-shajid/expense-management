'use client'

import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'
import WithdrawTable from './WithdrawTable'

export default function TransactionsPage() {
  const { getAllWithdraws } = useApi()
  let { data, isError, error, isLoading } = getAllWithdraws()

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading) return <Loading page />

  return (
    <>
      <div className="title">All Withdraw</div>
      <div className='mt-6'>
        <Link href={'/withdraw/addnew'} className="add_button">Add Withdraw</Link>
        <WithdrawTable data={data} />
      </div>
    </>
  )
}
