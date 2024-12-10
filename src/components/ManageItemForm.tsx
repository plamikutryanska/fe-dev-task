'use client'
import { useState } from "react"
import DropdownSearch from "./DropdownSearch"
import { CombinedData } from "@/types/carTypes"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import {CarBrand, CarCoupe, CarModel} from '@lib/_generated/graphql_sdk'
import BrandAndModelsDropdown from "./BrandAndModelsDropdown"

type PartialCarModel = Pick<CarModel, "id" | "name">
const coupe = Object.values(CarCoupe)

const ManageItemForm = () => {

  const {data, addCarBrand, editCarBrand, deleteCarBrand } = useCarDetailsContext()

  const [selectedBrand, setSelectedBrand] =  useState<CarBrand>({id:'', name: ''})
  const [selectedModel, setSelectedModel] =  useState<PartialCarModel>({id:'', name: ''})


  const [selectedCoupe, setSelectedCoupe] =  useState<string>('')
  const [modificationName, setModificationName] =  useState<string>('')
  const [horsepower, setHorsepower] =  useState<number>(0)
  const [weight, setWeight] =  useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleSelectedCoupe = (item: string) => [
    setSelectedCoupe(item)
  ]

  //this should be with brandID not string
  const handleModelsDropdown = (data: CombinedData[], selectedBrand: CarBrand) => {
    const brandModels = data.filter(brand => brand.brand.name === selectedBrand.name)
    return brandModels.flatMap(b => b.models.map(mod => mod.name))
  }

  selectedBrand && handleModelsDropdown(data, selectedBrand)

 const disabledInputs = selectedModel.name === ''


  return (
    <div className="flex justify-center items-center mt-24 mb-24">
      <div className='flex flex-col p-8 size-3/4 h-screen bg-violet-300 rounded'>
      <div className="h-8 uppercase font-bold">Car Brands</div>
      <div className="border-b border-black w-fill"/>
        <BrandAndModelsDropdown
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

{/* 
      <div className="flex justify-between">


        <div className="flex flex-col w-64 mt-6">
          <label className="uppercase text-sm">Horsepower</label>
          <input
            placeholder={'0'}
            value={horsepower}
            onChange={(e) => setHorsepower(Number(e.target.value))}
            className={`w-full px-3 py-2 focus:outline-none text-black border border-white ${disabledInputs && "bg-violet-200"}`}
            disabled={disabledInputs}
        />
        </div>


        <div className="flex flex-col w-64 mt-6">
        <label className="uppercase text-sm">Weight</label>
        <input
          placeholder={'0'}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className={`w-full px-3 py-2 focus:outline-none text-black border border-white ${disabledInputs && "bg-violet-200"}`}
          disabled={disabledInputs}
      />
      </div>
       </div> */}











       {/* <div className="flex justify-between">
       <DropdownSearch
          title='car coupe'
          dropdownLabel="Select a coupe"
          listItems={coupe}
          handleSelection={handleSelectedCoupe}
          selectedItem={selectedCoupe}
          createButtonFn={() => console.log('create coupe')}
          disabled={disabledInputs}
          isRequired
        /> 
        <div className="flex flex-col w-64 mt-6">
          <label className="uppercase text-sm">Modification Name</label>
          <input
            placeholder={''}
            value={modificationName}
            onChange={(e) => setModificationName(e.target.value)}
            className={`w-full px-3 py-2 focus:outline-none text-black border border-white ${disabledInputs && "bg-violet-200"}`}
            disabled={disabledInputs}
        />
        </div>
       </div> */}
      </div>
    </div>
  )
}

export default ManageItemForm