import { FC, useMemo, useState } from "react"
import DropdownSearch from "./DropdownSearch"
import ModificationModel from "./ModificationModel"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import { CarCoupe, CarModificationData} from "@/lib/_generated/graphql_sdk"

type ModificationFormProps = {
  brandId: string
  modelId: string
}

const ModificationForm: FC<ModificationFormProps> = ({brandId, modelId}) => {
  const {data, deleteCarModification, addCarModifications, editCarModification} = useCarDetailsContext()

  const defaultCarModification: CarModificationData = {
    id:'',
    name: '',
    coupe: undefined,
    horsePower: 0,
    weight: 0
  }

  const [selectedModification, setSelectedModification] =  useState<CarModificationData>(defaultCarModification)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const selectedBrand = data.find((b) => b.brand.id === brandId)
  const selectedModel = selectedBrand?.models.filter(mod => mod.id.toString() === modelId.toString())[0]

  const carModificationsByBrandModel = useMemo(() => {
    return data.filter((car) => car.brand.id.toString() === brandId.toString())
    .flatMap((model) => model.models.filter((mod) => mod.id.toString() === modelId.toString()))
  }, [data, brandId, modelId])


  const handleModifictionNameItems = useMemo(() => {
    return carModificationsByBrandModel[0]?.modifications.map((item) => ({
      id: item.id,
      name: item.name
    })) || []
  }, [carModificationsByBrandModel])

  const selectedModificationDetails = useMemo(() => {
    return carModificationsByBrandModel[0]?.modifications.find((item) => {
      return item.id === selectedModification.id
    }) || defaultCarModification
  }, [carModificationsByBrandModel, selectedModification])

  const handleModalInputChange = (value: {id: string; name: string}) => {
    setSelectedModification(value)
  }


  const clearModalInput = () => {
    setSelectedModification({id: '', name: ''})
  }

  const handleDirectEditTestV2 = async (updatedData: CarModificationData) => {
    const {id, name, horsePower, weight} = updatedData
    const validHorsePower = horsePower ?? 50
    const validWeight = weight ?? 500

    if(id && name){
      await editCarModification({
        id,
        name,
        coupe: CarCoupe.Convertible, // NEEDS WORK
        horsePower: validHorsePower,
        weight: validWeight,
        model: {
          id: selectedModel?.id.toString() || '',
          name: selectedModel?.name || '', 
          brand: {id: selectedBrand?.brand.id.toString() || '', name: selectedBrand?.brand.name || ''

          }}
      });
      setIsModalOpen(false)
    }
  };

  return (         
    <div className="flex flex-col justify-between items-center">
    <div className="flex flex-row w-64 ml-1 z-30">
    <DropdownSearch
      title='modifications'
      dropdownLabel="Select modification name"
      listItems={handleModifictionNameItems}
      handleSelection={(item) => setSelectedModification(item)}
      createButtonFn={({name}) => addCarModifications(modelId, name) }
      selectedItem={selectedModification.name || ''}
      createContext={'modification'}
      disabled={modelId === ''}
   />
    {selectedModification.name &&
      <button
        onClick={() => setIsModalOpen(true)} 
        className="flex h-10 mt-11 md:mt-11 items-center px-3 bg-black text-white rounded"
      >
        Edit
      </button>
    }
    </div>
    {isModalOpen && <ModificationModel
      title={'Edit Modal'}
      subTitle="Edit modification details"
      closeFn={() => setIsModalOpen(false)}
      inputData={{
        id: selectedModification.id,
        name: selectedModification.name || '',
        horsePower: selectedModification.horsePower || 0,
        weight: selectedModification.weight || 0
      }}
      onInputChange={handleModalInputChange}
      clearInput={clearModalInput}
      editFn={handleDirectEditTestV2}
      deleteFn={deleteCarModification}
      />
    }
      <div className="flex flex-col w-64 mt-6 ">
        <label className="uppercase text-sm">Horsepower</label>
        <div className={`w-full px-3 py-2 mr-1 text-black bg-white rounded`}>
          {selectedModificationDetails.horsePower || 0}
        </div>
      </div>
      <div className="flex flex-col w-64 mt-6">
        <label className="uppercase text-sm">Weight</label>
        <div className={`w-full px-3 py-2 mr-1 text-black bg-white rounded`}>
          {selectedModificationDetails.weight || 0}
        </div>
      </div>
   </div>
  )
}

export default ModificationForm