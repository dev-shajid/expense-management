import React from 'react'
import TransactionTable from './TransactionTable'
import Link from 'next/link'

export default function TransactionsPage() {
  return (
    <>
      <div className="title">All Transaction</div>
      <div className='mt-8 space-y-4'>
        <Link href={'/transactions/addnew'} className="add_button">Add Projects</Link>
        <TransactionTable />
      </div>
    </>
  )
}
