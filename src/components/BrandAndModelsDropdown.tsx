import { SetStateAction, useState, Dispatch } from "react"
import DropdownSearch from "./DropdownSearch"
import Modal from "./Modal"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import {CarBrand, CarModel} from '@lib/_generated/graphql_sdk'


type PartialCarModel = Pick<CarModel, "id" | "name">

type BrandAndModelsDropdownProps = {
  selectedBrand: CarBrand,
  setSelectedBrand: Dispatch<SetStateAction<CarBrand>>
  selectedModel: PartialCarModel,
  setSelectedModel: Dispatch<SetStateAction<PartialCarModel>>
}

const BrandAndModelsDropdown = (props: BrandAndModelsDropdownProps) => {
  const {selectedBrand, setSelectedBrand, selectedModel, setSelectedModel} = props

  const {data, addCarBrand, editCarBrand, deleteCarBrand, deleteCarModel, addCarModel, editCarModel} = useCarDetailsContext()

  const [modalState, setModalState] = useState({
    isBrandModalOpen: false,
    isModelModalOpen: false
  })

  const [inputState, setInputState] = useState({
    brand: selectedBrand,
    model: selectedModel
  })

  const toggleModal = (modalType: 'brand' | 'model', isOpen: boolean) => {
    setModalState((prv) => ({
      ...prv,
      [`is${modalType.charAt(0).toUpperCase() + modalType.slice(1)}ModalOpen`]: isOpen
    }))
  }

  const handleDropdownItems = () => {
    return data.map((item => item.brand))
  }

  const handleModelsDropdown = () => {
    const brandModels = data.filter(brand => brand.brand.name === selectedBrand.name)
    return brandModels.flatMap(b => b.models)
  }

  const handleInputChange = (type: 'brand' | 'model', value: CarBrand | PartialCarModel) => {
    setInputState((prv) => ({...prv, [type]: value}))
  }

  const clearInput = (type: 'brand' | 'model') => {
    setInputState((prv) => ({...prv, [type]: {id: "", name: ""}}))
  }

  const handleSelection = (type: 'brand' | 'model', item: CarBrand | PartialCarModel) => {
    if(type === 'brand'){
      setSelectedBrand(item as CarBrand)
      setInputState((prv) => ({...prv, brand: item as CarBrand}))
    } else {
      setSelectedModel(item as PartialCarModel),
      setInputState((prv) => ({...prv, model: item as PartialCarModel}))
    }
  }

  return (
    <div className="flex justify-between">
    <div className="flex">
    <DropdownSearch 
      title='brand'
      dropdownLabel="Select a brand"
      listItems={handleDropdownItems()}
      handleSelection={(item) => handleSelection('brand', item)}
      createButtonFn={({name}) => addCarBrand(name)}
      selectedItem={selectedBrand.name}
      createContext="brand"
      isRequired
    />
    {selectedBrand.name &&
      <button
        onClick={() => toggleModal("brand", true)} 
        className="flex h-10 mt-11 items-center px-3 bg-black text-white rounded float-right"
      >
        Edit
      </button>
    }
    {modalState.isBrandModalOpen && <Modal
      title={'Edit Modal'}
      subTitle="Edit car brand"
      closeFn={() => toggleModal('brand', false)}
      inputData={inputState.brand}
      onInputChange={(value) => handleInputChange('brand', value)}
      clearInput={() => clearInput('brand')}
      editFn={editCarBrand}
      deleteFn={deleteCarBrand}
      // onEditSuccess={(updatedBrand) => setSelectedBrand(updatedBrand as CarBrand)}
    />}
    </div>
    <div className="flex">
      <DropdownSearch
        title='model'
        dropdownLabel="Select a model"
        listItems={handleModelsDropdown()}
        handleSelection={(item) => handleSelection('model', item)}
        selectedItem={selectedModel.name}
        createButtonFn={({name}) => addCarModel(selectedBrand.id.toString(), name)}
        createContext="model"
        additionalParam={selectedBrand.id.toString()}
        disabled={!selectedBrand.name}
        isRequired
      />
      {selectedModel.name &&
        <button
          onClick={() => toggleModal('model', true)} 
          className="flex h-10 mt-11 items-center px-3 bg-black text-white rounded float-right"
        >
          Edit
        </button>
      }
    {modalState.isModelModalOpen && <Modal
      title={'Edit Modal'}
      subTitle="Edit car model"
      closeFn={() =>  toggleModal('model', false)}
      inputData={inputState.model}
      onInputChange={(value) => handleInputChange('model', value)}
      clearInput={() => clearInput('model')}
      editFn={editCarModel}
      deleteFn={deleteCarModel}
    />}

    </div>
  </div>

  )
}

export  default BrandAndModelsDropdown