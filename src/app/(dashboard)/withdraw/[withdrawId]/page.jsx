'use client'

import TransactionTable from './TransactionTable'
import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'
import dayjs from 'dayjs'

export default function WithdrawPage({ params }) {
  const { getAllTransactions, getWithdraw } = useApi()
  let { data, isError, error, isLoading } = getAllTransactions({ withdrawId: params.withdrawId })
  let {data:withdraw, isLoading:withdrawIsLoading, isError:withdrawIsError, error:withdrawError} = getWithdraw({ id: params.withdrawId })

  if (isError || withdrawIsError) return <div>Error: {JSON.stringify(error || withdrawError, null, 2)}</div>
  if (isLoading || withdrawIsLoading) return <Loading page />
  const rows = [
    { title: "Date", value: dayjs(withdraw?.start).format('D MMM YYYY') },
    { title: "Bank Account", value: withdraw?.bank_account },
    { title: "Amount", value: withdraw?.amount },
    { title: "Previous", value: withdraw?.previous },
    { title: "Remaining", value: withdraw?.remaining },
  ]

  return (
    <section className='container'>
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
      {withdraw?.details ? <div className='grid gap-1 mt-4 bg-white rounded-md p-4 border'>
        <span className='text-xs text-gray-500'>Withdraw Details</span>
        <span className='text-sm'>{withdraw.details}</span>
      </div> : null}

      <div className='mt-8'>
        <div className="title">All Transaction</div>
        <div className='mt-6'>
          <Link href={`/withdraw/${params.withdrawId}/add_transaction`} className="add_button">Add Transaction</Link>
          {
            data?.length ?
              <TransactionTable data={data} /> :
              <div className='text-center font-medium text-2xl text-gray-400 select-none'>No withdraw yet.</div>
          }
        </div>
      </div>
    </section>
  )
}
