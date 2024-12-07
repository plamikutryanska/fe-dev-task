import { GraphQLBackend } from '@lib/api/graphql'
import Link from 'next/link'
import EmptyState from '@/components/EmptyState'
import Table from '@/components/Table'
import './globals.css'

export default async function Home() {
  const brand = await GraphQLBackend.GetBrands()

  const handleTableData = () => {
    return brand.carBrands.map(car => {
      return {
        id: car.id,
        brand: car.name,
        model: 'carModel',
        modification: 'modificationName',
        horsepower: 'horsepower',
        weight: 'weight'
      }
    })
  }


  return (
    <div className="p-8">
      <Link href={'/edit'} className='flex items-center gap-2 p-2 bg-black text-white rounded float-right'>Manage Items</Link>
      {
        handleTableData().length === 0 ? 
        <EmptyState message="No Car Data Available"/> :
        <Table data={handleTableData()}/>
      }
    </div>
  )
}