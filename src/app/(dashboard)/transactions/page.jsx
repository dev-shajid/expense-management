import TransactionTable from './TransactionTable'
import Link from 'next/link'
import { GetAllTransactions } from '../../../../action/api'

export default async function TransactionsPage() {
  // const [data, setData] = useState([])
  // async function getData() {
  //   setData(await GetAllTransactions())
  // }

  // useEffect(() => {
  //   getData()
  // }, [])
  // console.log({data})

  let data = await GetAllTransactions()
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
