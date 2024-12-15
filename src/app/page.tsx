'use client'
import { FC } from 'react'
import Link from 'next/link'
import EmptyState from '@/components/EmptyState'
import Table from '@/components/Table'
import { handleTableData } from '@/utils/carUtils'
import { useBrandsWithModels } from '@/hooks/useBrandsWithModels'
import './globals.css'

const Home:FC = () => {
  const { data: brandsWithModels, isError,isLoading } = useBrandsWithModels();
    if(isLoading) {
      return <EmptyState message={'Loading...'}/>
    }
    if(isError) {
      return <EmptyState message={'An Error has occured'}/>
    }

    if(!isLoading && (!brandsWithModels || brandsWithModels.length === 0)){
      return <EmptyState message={'No Car Data Available'}/>
    }

  if(!brandsWithModels) return null

  return (
    <div className="p-8">
      <Link href={'/edit'} className='flex items-center gap-2 p-2 bg-black text-white rounded float-right'>Manage Items</Link>
      <Table 
        data={brandsWithModels && handleTableData(brandsWithModels) || []}
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