'use client'
import { useState } from "react"
import DropdownSearch from "./DropdownSearch"

type ManageItemFormProp = {
  formData: Array<{ [key: string]: unknown }>
}

//brands {[string]: Array<string>} dropdown
//model {[string]: Array<string>} dropdown
//

const brands = ['toyota', 'audi', 'lexus', 'honda', 'bmw', 'ford']
const models = ['model1', 'model2', 'model3','model4','model5','model6']
const coupe = ['CONVERTIBLE', 'COUPE', 'HATCHBACK','SEDAN','SUV','TRUCK', 'VAN', 'WAGON']

const DUMMY_DATA = {
  carBrands: [
    { id: 1, name: 'Audi' },
    { id: 2, name: 'BMW' },
    { id: 5, name: 'Toyota' },
    { id: 4, name: 'Ford' },
  ],
  carModels: [
    { id: 27, name: 'A8', brand: { id: 5, name: 'Toyota' } },
    { id: 28, name: 'A4', brand: { id: 5, name: 'Toyota' } },
    { id: 29, name: 'NX', brand: { id: 5, name: 'Toyota' } },
    { id: 30, name: 'A5', brand: { id: 5, name: 'Toyota' } },
    { id: 31, name: 'A9', brand: { id: 1, name: 'Audi' } },
    { id: 32, name: 'A10', brand: { id: 1, name: 'Audi' } },
    { id: 33, name: 'BB', brand: { id: 1, name: 'Audi' } },
    { id: 34, name: 'A500', brand: { id: 1, name: 'Audi' } },
    { id: 35, name: 'FOO', brand: { id: 2, name: 'BMW' } },
    { id: 36, name: 'FOO2', brand: { id: 2, name: 'BMW' } },
    { id: 37, name: 'FOO3', brand: { id: 2, name: 'BMW' } },
    { id: 38, name: 'FOO4', brand: { id: 2, name: 'BMW' } },
    { id: 39, name: 'FORD1', brand: { id: 4, name: 'Ford' } },
    { id: 40, name: 'FORD2', brand: { id: 4, name: 'Ford' } },
    { id: 41, name: 'FORD3', brand: { id: 4, name: 'Ford' } },
    { id: 42, name: 'FORD4', brand: { id: 4, name: 'Ford' } },
  ],
  carModifications: [
    {
      coupe: 'COUPE',
      horsePower: 600,
      id: 105,
      model: { id: 31, name: 'A9', brand: { id: 1, name: 'Audi' } },
      name: 'Audi Modification',
      weight: 1600
    },
    {
      coupe: 'CONVERTIBLE',
      horsePower: 700,
      id: 100,
      model: { id: 27, name: 'A8', brand: { id: 5, name: 'Toyota' } },
      name: 'Toyota Modification',
      weight: 1500
    },
    {
      coupe: 'SUV',
      horsePower: 900,
      id: 111,
      model: { id: 27, name: 'A8', brand: { id: 5, name: 'BMW' } },
      name: 'BMW Modification',
      weight: 1700
    },
    {
      coupe: 'HATCHBACK',
      horsePower: 900,
      id: 112,
      model: { id: 39, name: 'FORD1', brand: { id: 4, name: 'Ford' } },
      name: 'Ford Modification',
      weight: 1200
    },
    
  ]

  }


const ManageItemForm = () => {
  const [selectedBrand, setSelectedBrand] =  useState<string>('')
  const [selectedModel, setSelectedModel] =  useState<string>('')
  const [selectedCoupe, setSelectedCoupe] =  useState<string>('')
  const [modificationName, setModificationName] =  useState<string>('')
  const [horsepower, setHorsepower] =  useState<number>(0)
  const [weight, setWeight] =  useState<number>(0)

  const handleSelectedBrand = (item: string) => [
    setSelectedBrand(item)
  ]

  const handleSelectedModel = (item: string) => [
    setSelectedModel(item)
  ]

  const handleSelectedCoupe = (item: string) => [
    setSelectedCoupe(item)
  ]



  return (
    <div className="flex justify-center items-center mt-24 mb-24">
      <div className='flex flex-col p-8 size-3/4 h-screen bg-zinc-200 rounded'>
      <div className="h-8 uppercase font-bold">Car Brands</div>
      <div className="border-b border-black w-fill"/>
      <div className="flex justify-between">
        <DropdownSearch 
          title='brand'
          dropdownLabel="Select a brand"
          listItems={brands}
          handleSelection={handleSelectedBrand}
          selectedItem={selectedBrand}
          isRequired
        />
        <DropdownSearch
          title='model'
          dropdownLabel="Select a model"
          listItems={models}
          handleSelection={handleSelectedModel}
          selectedItem={selectedModel}
          isRequired
        />
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col w-64 mt-6">
          <label className="uppercase text-sm">Horsepower</label>
          <input
            placeholder={'0'}
            value={horsepower}
            onChange={(e) => setHorsepower(Number(e.target.value))}
            className="w-full px-3 py-2 focus:outline-none text-black"
        />
        </div>
        <div className="flex flex-col w-64 mt-6">
        <label className="uppercase text-sm">Weight</label>
        <input
          placeholder={'0'}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full px-3 py-2 focus:outline-none text-black"
      />
      </div>
       </div>

       <div className="flex justify-between">

       <DropdownSearch
          title='car coupe'
          dropdownLabel="Select a coupe"
          listItems={coupe}
          handleSelection={handleSelectedCoupe}
          selectedItem={selectedCoupe}
          isRequired
        /> 
        <div className="flex flex-col w-64 mt-6">
          <label className="uppercase text-sm">Modification Name</label>
          <input
            placeholder={''}
            value={modificationName}
            onChange={(e) => setModificationName(e.target.value)}
            className="w-full px-3 py-2 focus:outline-none text-black"
        />
        </div>

       </div>

      </div>
    </div>
  )
}

export default ManageItemForm