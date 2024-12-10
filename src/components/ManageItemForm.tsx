'use client'
import { useState } from "react"
import DropdownSearch from "./DropdownSearch"
import DropdownNoSearch from "./DropdownNoSearch"
import { CombinedData } from "@/types/carTypes"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import {CarBrand, CarCoupe, CarModel} from '@lib/_generated/graphql_sdk'
import BrandAndModelsDropdown from "./BrandAndModelsDropdown"
import Modal from "./Modal"

type PartialCarModel = Pick<CarModel, "id" | "name">
const coupe = Object.values(CarCoupe)

const ManageItemForm = () => {

  const {data, deleteCarModification} = useCarDetailsContext()

  const [selectedBrand, setSelectedBrand] =  useState<CarBrand>({id:'', name: ''})
  const [selectedModel, setSelectedModel] =  useState<PartialCarModel>({id:'', name: ''})
  const [selectedCoupe, setSelectedCoupe] =  useState<string>('')
  const [modificationName, setModificationName] =  useState<{id: string, name: string}>({id:'', name: ''})
  const [horsepower, setHorsepower] =  useState<number>(0)
  const [weight, setWeight] =  useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

//GET CAR MODIFICATIONS BASED ON SELECTED BRAND AND MODEL
const getCarModifications = (brandId: string, modelId: string) => {
  return data.filter((car) => car.brand.id.toString() === brandId.toString())
  .flatMap((model) => 
    model.models.filter((mod) => mod.id.toString() === modelId.toString())
  )
}

const carModificationsByBrandModel = getCarModifications(selectedBrand.id, selectedModel.id)

const getListOfModificationNames = carModificationsByBrandModel[0]?.modifications.filter((mod) => mod.coupe === selectedCoupe)

const handleModifictionNameItems = () => {
  return getListOfModificationNames?.map((item) => {
    return ({
      id: item.id,
      name: item.name
    })
  })
}


const getHorsePowerWeight = () => {
  return getListOfModificationNames?.filter((item) => item.id.toString() === modificationName.id.toString())[0]
}

const horsePowerWeight = getHorsePowerWeight()

console.log('horde ====>', horsePowerWeight)


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
  
       <div className="flex justify-between md:flex-col lg:flex-row items-center">
        <DropdownNoSearch
          title='car coupe'
          dropdownLabel="Select a coupe"
          listItems={Object.values(CarCoupe)}
          selectedItem={selectedCoupe}
          handleSelection={setSelectedCoupe}
          disabled={!selectedModel.name}
        />
        <div className="flex flex-row w-64 ml-1">
        <DropdownSearch
          title='modification name'
          dropdownLabel="Select modification name"
          listItems={handleModifictionNameItems()}
          handleSelection={setModificationName}
          createButtonFn={({name}) => console.log('ADD MOD NAME ===>')}
          selectedItem={modificationName.name}
          createContext={'modification'}
          disabled={!selectedCoupe}
       />
        {modificationName.name &&
          <button
            onClick={() => setIsModalOpen(true)} 
            className="flex h-10 mt-11 md:mt-11 items-center px-3 bg-black text-white rounded"
          >
            Edit
          </button>
        }
        </div>
        {isModalOpen && <Modal
          title={'Edit Modal'}
          subTitle="Edit modification name"
          closeFn={() => setIsModalOpen(false)}
          inputData={modificationName}
          onInputChange={(value: {id: string, name: string}) => setModificationName(value)}
          clearInput={() => setModificationName({id: '', name: ''})}
          editFn={() => console.log('edit modification ===>')}
          deleteFn={deleteCarModification}
    />
        
        }



       </div>
      {/* <div className="flex justify-between md:flex-col lg:flex-row items-center">
        <div className="flex flex-col w-64 mt-6 ">
          <label className="uppercase text-sm">Horsepower</label>
          <input
            // placeholder={'0'}
            value={getHorsePowerWeight()?.horsePower?.toString() || horsepower}
            onChange={(e) => setHorsepower(Number(e.target.value))}
            className={`w-full px-3 py-2 mr-1 focus:outline-none text-black border border-white rounded ${!modificationName.name && "bg-violet-200"}`}
            disabled={!modificationName.name}
         />
        </div>
          <div className="flex flex-col w-64 mt-6">
          <label className="uppercase text-sm">Weight</label>
          <input
            // placeholder={'0'}
            value={getHorsePowerWeight()?.weight?.toString() || weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className={`w-full px-3 py-2 ml-1 focus:outline-none text-black border border-white rounded ${!modificationName.name && "bg-violet-200"}`}
            disabled={!modificationName.name}
          />
          </div>
       </div> */}
      </div>
    </div>
  )
}

export default ManageItemForm