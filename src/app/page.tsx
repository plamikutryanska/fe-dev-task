'use client'
import Link from 'next/link'
import EmptyState from '@/components/EmptyState'
import Table from '@/components/Table'
import { useCarDetailsContext } from '@/store/CarContextProvider'
import { handleTableData } from '@/utils/carUtils'
import './globals.css'


const Home = () => {
  const {data, loading, error} = useCarDetailsContext()

  if(loading) return<div>LOADING.....</div>
  if(error) return<div>ERROR.....</div>

  const tableData = handleTableData(data)

  return (
    <div className="p-8">
      <Link href={'/edit'} className='flex items-center gap-2 p-2 bg-black text-white rounded float-right'>Manage Items</Link>
      {
        tableData.length === 0 ? 
        <EmptyState message="No Car Data Available"/> :
        <Table data={tableData}/>
      }
    </div>
  )
}

export default Home