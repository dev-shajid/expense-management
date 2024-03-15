'use client'

import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'
import CustomersTable from './CustomersTable'

export default function CustomersPage() {
  const { getCustomers } = useApi()
  let { data, isError, error, isLoading } = getCustomers

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading) return <Loading page />

  return (
    <>
      <div className="title">Customers</div>
      <div className='mt-6'>
        <Link href={'/customers/addnew'} className="add_button">New Customer</Link>
        <CustomersTable data={data} />
      </div>
    </>
  )
}
