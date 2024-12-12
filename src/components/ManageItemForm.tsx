'use client'
import { FC, useEffect, useState } from "react"
import DropdownSearch from "./DropdownSearch"
import DropdownNoSearch from "./DropdownNoSearch"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import {CarBrand, CarCoupe, CarModel} from '@lib/_generated/graphql_sdk'
import BrandAndModelsDropdown from "./BrandAndModelsDropdown"
import Modal from "./Modal"

type PartialCarModel = Pick<CarModel, "id" | "name">

const ManageItemForm: FC = () => {

  const {data, deleteCarModification, addCarModifications} = useCarDetailsContext()

  const [selectedBrand, setSelectedBrand] =  useState<CarBrand>({id:'', name: ''})
  const [selectedModel, setSelectedModel] =  useState<PartialCarModel>({id:'', name: ''})
  const [selectedCoupe, setSelectedCoupe] =  useState<CarCoupe | string>('')
  const [modificationIdName, setModificationIdName] =  useState<{id: string, name: string}>({id:'', name: ''})
  const [horsepower, setHorsepower] =  useState<number>(0)
  const [weight, setWeight] =  useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  console.log('modificationIdName ===>', modificationIdName)

  useEffect(() => {
    setSelectedModel({id:'', name: ''})
    setModificationIdName({id:'', name: ''})
    setSelectedCoupe('')
  },[selectedBrand])


const getCarModifications = (brandId: string, modelId: string) => {
  return data.filter((car) => car.brand.id.toString() === brandId.toString())
  .flatMap((model) => 
    model.models.filter((mod) => mod.id.toString() === modelId.toString())
  )
}

const carModificationsByBrandModel = getCarModifications(selectedBrand.id, selectedModel.id)
console.log('carModificationsByBrandModel ===>', carModificationsByBrandModel)

const handleModifictionNameItems = () => {
  console.log('carModificationsByBrandModel[0] ===>', carModificationsByBrandModel[0])

  return carModificationsByBrandModel[0]?.modifications.map((item) => {
    return ({
      id: item.id,
      name: item.name
    })
  })
}


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
       <div className="flex justify-between md:flex-col sm: flex-col lg:flex-row items-center">
        <div className="flex flex-row w-64 ml-1">
        <DropdownSearch
          title='modification name'
          dropdownLabel="Select modification name"
          listItems={handleModifictionNameItems()}
          handleSelection={(item) => setModificationIdName(item)}
          createButtonFn={({ name}) => addCarModifications(selectedModel.id, name) }
          selectedItem={modificationIdName.name}
          createContext={'modification'}
          disabled={!selectedModel.name}
       />
        {modificationIdName.name &&
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
          inputData={modificationIdName}
          onInputChange={(value: {id: string, name: string}) => setModificationIdName(value)}
          clearInput={() => setModificationIdName({id: '', name: ''})}
          editFn={() => console.log('edit modification ===>')}
          deleteFn={deleteCarModification}
          />
        }
          <DropdownNoSearch
            title='car coupe'
            dropdownLabel="Select a coupe"
            listItems={Object.values(CarCoupe)}
            selectedItem={selectedCoupe as CarCoupe}
            handleSelection={setSelectedCoupe}
            disabled={!selectedModel.name}
         />
       </div>
        {/* <div className="flex justify-between md:flex-col sm:flex-col lg:flex-row items-center">
          <div className="flex flex-col w-64 mt-6 ">
            <label className="uppercase text-sm">Horsepower</label>
            <input
              // placeholder={'0'}
              value={getHorsePowerWeight()?.horsePower?.toString() || horsepower}
              onChange={(e) => setHorsepower(Number(e.target.value))}
              className={`w-full px-3 py-2 mr-1 focus:outline-none text-black border border-white rounded ${!modificationIdName.name && "bg-violet-200"}`}
              disabled={!modificationIdName.name}
          />
          </div>
            <div className="flex flex-col w-64 mt-6">
            <label className="uppercase text-sm">Weight</label>
            <input
              // placeholder={'0'}
              value={getHorsePowerWeight()?.weight?.toString() || weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className={`w-full px-3 py-2 ml-1 focus:outline-none text-black border border-white rounded ${!modificationIdName.name && "bg-violet-200"}`}
              disabled={!modificationIdName.name}
            />
            </div>
        </div> */}
      </div>
    </div>
  )
}

export default ManageItemForm