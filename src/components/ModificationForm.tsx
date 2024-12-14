import { FC, useMemo, useState } from "react"
import DropdownSearch from "./DropdownSearch"
import ModificationModel from "./ModificationModel"
import { InfoField } from "./InfoField"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import { CarCoupe, CarModificationData} from "@/lib/_generated/graphql_sdk"
import { getCarModificationsByBrandModel, getModificationNameId, getSelectedModificationDetails } from "@/utils/carUtils"

type ModificationFormProps = {
  brandId: string
  modelId: string
}

const defaultCarModification: CarModificationData = {
  id:'',
  name: '',
  coupe: CarCoupe.Convertible,
  horsePower: 0,
  weight: 0
}


const ModificationForm: FC<ModificationFormProps> = ({brandId, modelId}) => {
  const {data, deleteCarModification, addCarModifications, editCarModification} = useCarDetailsContext()

  const [selectedModification, setSelectedModification] =  useState<CarModificationData>(defaultCarModification)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedCoupe, setSelectedCoupe] = useState<CarCoupe | ''>('')

  const selectedBrand = data.find((b) => b.brand.id === brandId)
  const selectedModel = selectedBrand?.models.filter(mod => mod.id.toString() === modelId.toString())[0]

  const carModificationsByBrandModel = useMemo(() => {
    return getCarModificationsByBrandModel(data, brandId, modelId)
  }, [data, brandId, modelId])

  const handleModificationNameId = useMemo(() => {
    return getModificationNameId(carModificationsByBrandModel[0]?.modifications)
  }, [carModificationsByBrandModel])

  const selectedModificationDetails = useMemo(() => {
    return getSelectedModificationDetails(
      carModificationsByBrandModel[0]?.modifications,
      selectedModification.id,
      defaultCarModification
    )
  }, [carModificationsByBrandModel, selectedModification])


  const handleModalInputChange = (value: {id: string; name: string}): void => {
    setSelectedModification(value)
  }

  const clearModalInput = (): void => {
    setSelectedModification({id: '', name: ''})
  }

  const handleEditModification = async (updatedData: CarModificationData) => {
    const {id, name, horsePower, weight} = updatedData
    const validHorsePower = horsePower ?? 50
    const validWeight = weight ?? 500
    const defaultCoupe = selectedCoupe || CarCoupe.Convertible //fallback to convertable

    if(id && name){
      await editCarModification({
        id,
        name,
        horsePower: validHorsePower,
        weight: validWeight,
        coupe: defaultCoupe,
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
    <label className="uppercase font-semibold mt-2">Modification Details</label> 
    <div className="flex flex-row w-64 ml-1 z-30">
    <DropdownSearch
      title='modification name'
      dropdownLabel="Select modification name"
      listItems={handleModificationNameId}
      handleSelection={(item) => setSelectedModification(item)}
      createButtonFn={({name}) => addCarModifications(modelId, name) }
      selectedItem={selectedModification.name || ''}
      createContext={'modification'}
      disabled={modelId === ''}
   />
    </div>
    <InfoField label="coupe" value={selectedModificationDetails.coupe || 'no coupe details'}/>
    <InfoField label="horsepower" value={selectedModificationDetails.horsePower || 0}/>
    <InfoField label="weight" value={selectedModificationDetails.weight || 0}/>
    {selectedModification.name &&
      <button
        onClick={() => setIsModalOpen(true)} 
        className="flex h-10 mt-2 items-center px-3 bg-black text-white rounded"
      >
        Edit Modifications
      </button>
    }
    {isModalOpen && <ModificationModel
      title={'Edit Modal'}
      subTitle="Edit modification details"
      closeFn={() => setIsModalOpen(false)}
      inputData={{
        id: selectedModification.id,
        name: selectedModification.name || '',
        horsePower: selectedModificationDetails.horsePower || 0,
        weight: selectedModificationDetails.weight || 0,
        coupe: selectedModificationDetails.coupe || CarCoupe.Convertible
      }}
      onInputChange={handleModalInputChange}
      clearInput={clearModalInput}
      editFn={handleEditModification}
      deleteFn={deleteCarModification}
      selectedCoupe={selectedCoupe}
      setSelectedCoupe={setSelectedCoupe}
      />
    }
   </div>
  )
}

export default ModificationForm