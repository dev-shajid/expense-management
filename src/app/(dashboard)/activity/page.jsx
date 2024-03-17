'use client'

import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'
import ActivityTable from './ActivityTable'

export default function ActivityPage() {
  // const { getAllActivities } = useApi()
  // let { data, isError, error, isLoading } = getAllActivities({page:1})
  // console.log(data)

  // if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  // if (isLoading) return <Loading page />


  return (
    <>
      <div className="title">All Activities</div>
      <div className='space-y-4'>
        <ActivityTable data={[]} />
      </div>
    </>
  )
}
