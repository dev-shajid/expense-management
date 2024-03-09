import React from 'react'
import TransactionTable from './TransactionTable'

export default function TransactionsPage() {
  return (
    <>
      <div className="title">All Transaction</div>
      <div className='mt-8 space-y-4'>
        <TransactionTable />
      </div>
    </>
  )
}
