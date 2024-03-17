import ActivityTable from './ActivityTable'

export default function ActivityPage() {

  return (
    <>
      <div className="title">All Activities</div>
      <div className='space-y-4'>
        <ActivityTable data={[]} />
      </div>
    </>
  )
}
