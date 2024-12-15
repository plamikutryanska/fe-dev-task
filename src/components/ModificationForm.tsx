import { FC, useMemo, useState } from "react"
import DropdownSearch from "./DropdownSearch"
import ModificationModel from "./ModificationModel"
import { InfoField } from "./InfoField"
import { CarCoupe, CarModificationData} from "@/lib/_generated/graphql_sdk"
import { getCarModificationsByBrandModel, getModificationNameId, getSelectedModificationDetails } from "@/utils/carUtils"
import {useBrandsWithModels} from '@/hooks/useBrandsWithModels'
import { useAddCarModification, useDeleteCarModification, useEditCarModification } from "@/hooks/useCarData"

type ModificationFormProps = {
  brandId: string
  modelId: string
}

type CarModification = {
  id: string,
  name: string,
  coupe: CarCoupe,
  weight: number,
  horsePower: number
}


const defaultCarModification: CarModification = {
  id:'',
  name: '',
  coupe: CarCoupe.Convertible,
  horsePower: 0,
  weight: 0
}


const ModificationForm: FC<ModificationFormProps> = ({brandId, modelId}) => {
  const { data: brandsWithModels, isError,isLoading } = useBrandsWithModels();
  const {mutateAsync: addCarModification } = useAddCarModification()
  const {mutateAsync: deleteCarModification } = useDeleteCarModification()
  const {mutateAsync: editCarModification } = useEditCarModification()

  const [selectedModification, setSelectedModification] =  useState<CarModificationData>(defaultCarModification)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedCoupe, setSelectedCoupe] = useState<CarCoupe | ''>('')

  const selectedBrand = brandsWithModels && brandsWithModels.find((b) => b.brand.id === brandId)
  const selectedModel = selectedBrand?.models.filter(mod => mod.model.id.toString() === modelId.toString())[0]

  const carModificationsByBrandModel = useMemo(() => {
    return brandsWithModels && getCarModificationsByBrandModel(brandsWithModels, brandId, modelId)
  }, [brandsWithModels, brandId, modelId])

  const handleModificationNameId = useMemo(() => {
    return carModificationsByBrandModel && getModificationNameId(carModificationsByBrandModel[0]?.modifications)
  }, [carModificationsByBrandModel])

  const selectedModificationDetails = useMemo(() => {
    return carModificationsByBrandModel && getSelectedModificationDetails(
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

  const handleEditModification = async (updatedData: CarModification) => {
    const {id, name, horsePower, weight, coupe} = updatedData
    const validHorsePower = horsePower ?? 50
    const validWeight = weight ?? 500
    const defaultCoupe = coupe || selectedCoupe || CarCoupe.Convertible //fallback to convertable

    if(id && name && selectedModel?.model.id){
      await editCarModification({
        id,
        name,
        horsePower: validHorsePower,
        weight: validWeight,
        coupe: defaultCoupe,
      });
      setIsModalOpen(false)
    } else {
      console.log('Missing required field')
    }
  };

  console.log('selectedCoupe ====>', selectedCoupe)
  console.log('selectedModification ====>', selectedModification)

  return (         
    <div className="flex flex-col justify-between items-center">
    <label className="uppercase font-semibold mt-2">Modification Details</label> 
    <div className="flex flex-row w-64 ml-1 z-30">
    <DropdownSearch
      title='modification name'
      dropdownLabel="Select modification name"
      listItems={handleModificationNameId ?? []}
      handleSelection={(item) => setSelectedModification(item)}
      createButtonFn={({name}) => addCarModification({modelId, name})}
      selectedItem={selectedModification.name || ''}
      createContext={'modification'}
      disabled={modelId === ''}
   />
    </div>
    <InfoField label="coupe" value={selectedModificationDetails?.coupe || 'no coupe details'}/>
    <InfoField label="horsepower" value={selectedModificationDetails?.horsePower || 0}/>
    <InfoField label="weight" value={selectedModificationDetails?.weight || 0}/>
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
        horsePower: selectedModificationDetails?.horsePower || 0,
        weight: selectedModificationDetails?.weight || 0,
        coupe: selectedModificationDetails?.coupe || CarCoupe.Convertible //fallback to Convertible
      }}
      onInputChange={handleModalInputChange}
      clearInput={clearModalInput}
      editFn={handleEditModification}
      deleteFn={() => deleteCarModification({id: selectedModification.id, modelId: modelId})}
      selectedCoupe={selectedCoupe}
      setSelectedCoupe={setSelectedCoupe}
      />
    }
   </div>
  )
}

export default ModificationForm