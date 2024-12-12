'use client'
import { FC } from 'react'
import Link from 'next/link'
import EmptyState from '@/components/EmptyState'
import Table from '@/components/Table'
import { useCarDetailsContext } from '@/store/CarContextProvider'
import { handleTableData } from '@/utils/carUtils'
import './globals.css'


const Home:FC = () => {
  const {data, loading, error} = useCarDetailsContext()

    if(loading) {
      return <EmptyState message={'Loading...'}/>
    }
    if(error) {
      return <EmptyState message={'An Error has occured'}/>
    }

    if(!loading && (!data || data.length === 0)){
      return <EmptyState message={'No Car Data Available'}/>
    }

  return (
    <div className="p-8">
      <Link href={'/edit'} className='flex items-center gap-2 p-2 bg-black text-white rounded float-right'>Manage Items</Link>
      <Table 
        data={handleTableData(data)}
        tableTitle='Car Details'
        headerAbbreviations={{
          weight: 'Wgt',
          horsepower: 'HP',
          modification: 'Mod',
          brand: 'Br',
          model: 'Md',
          coupe: 'Cp'
        }}/>
    </div>
  )
}

export default Home