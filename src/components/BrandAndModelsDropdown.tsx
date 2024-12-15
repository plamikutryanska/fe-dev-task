import { FC, SetStateAction, useState, Dispatch } from "react"
import {CarBrand, CarModel} from '@lib/_generated/graphql_sdk'
import DropdownSearch from "./DropdownSearch"
import Modal from "./Modal"
import { useAddCarBrand, useDeleteCarBrand, useEditCarBrand, useAddCarModel, useDeleteCarModel, useEditCarModel } from "@/hooks/useCarData"
import {useBrandsWithModels} from '@/hooks/useBrandsWithModels'

type PartialCarModel = Pick<CarModel, "id" | "name">

type BrandAndModelsDropdownProps = {
  selectedBrand: CarBrand,
  setSelectedBrand: Dispatch<SetStateAction<CarBrand>>
  selectedModel: PartialCarModel,
  setSelectedModel: Dispatch<SetStateAction<PartialCarModel>>
}

const BrandAndModelsDropdown: FC<BrandAndModelsDropdownProps> = (props) => {
  const {selectedBrand, setSelectedBrand, selectedModel, setSelectedModel} = props

  const {data: carData} = useBrandsWithModels()
  const {mutateAsync, isError} = useAddCarBrand()
  const {mutateAsync: deleteCarBrand} = useDeleteCarBrand()
  const {mutateAsync: editCarBrand} = useEditCarBrand()
  const {mutateAsync: addCarModel } = useAddCarModel()
  const {mutateAsync: deleteCarModel } = useDeleteCarModel()
  const {mutateAsync: editCarModel } = useEditCarModel()

  const [modalState, setModalState] = useState<{isBrandModalOpen: boolean, isModelModalOpen: boolean}>({
    isBrandModalOpen: false,
    isModelModalOpen: false
  })

  const [inputState, setInputState] = useState<{brand: CarBrand, model: PartialCarModel}>({
    brand: selectedBrand,
    model: selectedModel
  })

  const [successMessage, setSuccessMessage] = useState<string>('')

  const toggleModal = (modalType: 'brand' | 'model', isOpen: boolean): void => {
    setModalState((prv) => ({
      ...prv,
      [`is${modalType.charAt(0).toUpperCase() + modalType.slice(1)}ModalOpen`]: isOpen
    }))
  }

  const handleDropdownItems = (): CarBrand[] => {
    return carData?.map((item => item.brand)) || []
  }

  const handleModelsDropdown = () => {
    const brandModels = carData && carData.filter(brand => brand.brand.name === selectedBrand.name) || []
    return brandModels.flatMap(b => b.models.map(m => m.model))
  }

  const handleInputChange = (type: 'brand' | 'model', value: CarBrand | PartialCarModel): void => {
    setInputState((prv) => ({...prv, [type]: value}))
  }

  const clearInput = (type: 'brand' | 'model'): void => {
    setInputState((prv) => ({...prv, [type]: {id: "", name: ""}}))
    setSuccessMessage('')
  }

  const handleSelection = (type: 'brand' | 'model', item: CarBrand | PartialCarModel): void => {
    if(type === 'brand'){
      setSelectedBrand(item as CarBrand)
      setInputState((prv) => ({...prv, brand: item as CarBrand}))
    } else {
      setSelectedModel(item as PartialCarModel),
      setInputState((prv) => ({...prv, model: item as PartialCarModel}))
    }
  }

  const brandNameToDisplay = carData?.find((item => item.brand.id === selectedBrand.id))?.brand.name || ''
  const modelNameToDisplay = carData?.flatMap(item => item.models).filter(mod => mod.model.id === selectedModel.id)[0]?.model.name || ''

  const handleEditCarBrand = async (id: string, name: string) => {
    try {
      const updatedBrand = await editCarBrand({ id, name });
      setSuccessMessage(`Successfully updated brand: ${updatedBrand.name}`);
    } catch (error) {
      console.error("Failed to update car brand:", error);
      setSuccessMessage("Failed to update brand.");
    }
  };

  return (
    <div className="flex flex-col items-center">
    <div className="flex flex-col md:flex-row md:space-x-4 md:mb-0">
    <div className="flex flex-row md:flex-row md:mb-0 z-5">
      <DropdownSearch 
        title='brand'
        dropdownLabel="Select a brand"
        listItems={handleDropdownItems()}
        handleSelection={(item) => handleSelection('brand', item)}
        createButtonFn={({name}) => mutateAsync({name})}
        selectedItem={brandNameToDisplay}
        createContext="brand"
        isRequired
      />
      {selectedBrand.name &&
        <button
          onClick={() => toggleModal("brand", true)} 
          className="flex h-10 mt-9 md:mt-9 items-center px-3 bg-black text-white rounded"
        >
          Edit
        </button>
      }
    </div>
    {modalState.isBrandModalOpen && <Modal
      title={'Edit Modal'}
      subTitle="Edit car brand"
      closeFn={() => toggleModal('brand', false)}
      inputData={inputState.brand}
      onInputChange={(value) => handleInputChange('brand', value)}
      clearInput={() => clearInput('brand')}
      editFn={() => handleEditCarBrand(selectedBrand.id, inputState.brand.name)}
      deleteFn={( () => deleteCarBrand({id: selectedBrand.id}))}
      editMessage={successMessage}
    />}
    
    </div>
    <div className="flex flex-col md:flex-row md:space-x-4 md:mb-0 z-40">
    <div className="flex flex-row md:flex-row md:mb-0">
      <DropdownSearch
          title='model'
          dropdownLabel="Select a model"
          listItems={handleModelsDropdown()}
          handleSelection={(item) => handleSelection('model', item)}
          selectedItem={modelNameToDisplay}
          createButtonFn={({name}) => addCarModel({brandId: selectedBrand.id.toString(), name: name})}
          createContext="model"
          additionalParam={selectedBrand.id.toString()}
          disabled={!selectedBrand.name}
          isRequired
        />
        {selectedModel.name &&
          <button
            onClick={() => toggleModal('model', true)} 
            className="flex h-10 mt-9 md:mt-9 items-center px-3 bg-black text-white rounded"
          >
            Edit
          </button>
        }
    </div>
    {modalState.isModelModalOpen && <Modal
      title={'Edit Modal'}
      subTitle="Edit car model"
      closeFn={() =>  toggleModal('model', false)}
      inputData={inputState.model}
      onInputChange={(value) => handleInputChange('model', value)}
      clearInput={() => clearInput('model')}
      editFn={() => editCarModel({id: selectedModel.id, name: inputState.model.name})}
      deleteFn={() => deleteCarModel({id: selectedModel.id})}
      editMessage={successMessage}
    />}
    </div>
  </div>
  )
}

export default BrandAndModelsDropdown