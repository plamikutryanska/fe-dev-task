'use client'
import { useState } from "react"
import DropdownSearch from "./DropdownSearch"
import DropdownNoSearch from "./DropdownNoSearch"
import { CombinedData } from "@/types/carTypes"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import {CarBrand, CarCoupe, CarModel} from '@lib/_generated/graphql_sdk'
import BrandAndModelsDropdown from "./BrandAndModelsDropdown"

type PartialCarModel = Pick<CarModel, "id" | "name">
const coupe = Object.values(CarCoupe)

const ManageItemForm = () => {

  const {data} = useCarDetailsContext()

  const [selectedBrand, setSelectedBrand] =  useState<CarBrand>({id:'', name: ''})
  const [selectedModel, setSelectedModel] =  useState<PartialCarModel>({id:'', name: ''})
  const [selectedCoupe, setSelectedCoupe] =  useState<string>('')
  const [modificationName, setModificationName] =  useState<string>('')
  const [horsepower, setHorsepower] =  useState<number>(0)
  const [weight, setWeight] =  useState<number>(0)

 const disabledInputs = selectedModel.name === ''

  return (
    <div className="flex justify-center items-center mt-24 mb-24 ">
      <div className='flex flex-col p-8 size-3/4 h-screen bg-violet-300 rounded'>
      <div className="h-8 uppercase font-bold">Car Brands</div>
      <div className="border-b border-black w-fill"/>
      
      <BrandAndModelsDropdown
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
    

       <div className="flex justify-between">
        <DropdownNoSearch
          title='car coupe'
          dropdownLabel="Select a coupe"
          listItems={Object.values(CarCoupe)}
          selectedItem={selectedCoupe}
          handleSelection={setSelectedCoupe}
          disabled={!selectedModel.name}
        />
        <div className="flex flex-col w-64 mt-6 ml-1">
          <label className="uppercase text-sm">Modification Name</label>
          <input
            placeholder={''}
            value={modificationName}
            onChange={(e) => setModificationName(e.target.value)}
            className={`w-full px-3 py-2 focus:outline-none text-black border border-white ${disabledInputs && "bg-violet-200"}`}
            disabled={disabledInputs}
        />
        </div>
       </div>


      <div className="flex justify-between">
        <div className="flex flex-col w-64 mt-6 ">
          <label className="uppercase text-sm">Horsepower</label>
          <input
            placeholder={'0'}
            value={horsepower}
            onChange={(e) => setHorsepower(Number(e.target.value))}
            className={`w-full px-3 py-2 mr-1 focus:outline-none text-black border border-white ${disabledInputs && "bg-violet-200"}`}
            disabled={disabledInputs}
         />
        </div>
          <div className="flex flex-col w-64 mt-6">
          <label className="uppercase text-sm">Weight</label>
          <input
            placeholder={'0'}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className={`w-full px-3 py-2 ml-1 focus:outline-none text-black border border-white ${disabledInputs && "bg-violet-200"}`}
            disabled={disabledInputs}
          />
          </div>
       </div>
      </div>
    </div>
  )
}

export default ManageItemForm