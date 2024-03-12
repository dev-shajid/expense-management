import { GetAllActiviies } from '../../../../action/api'
import ActivityTable from './ActivityTable'

export default async function ActivityPage() {
  let data = await GetAllActiviies()
  return (
    <>
      <div className="title">All Activities</div>
      <div className='space-y-4'>
        <ActivityTable data={data} />
      </div>
    </>
  )
}
