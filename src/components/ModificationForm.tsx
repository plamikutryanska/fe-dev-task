import { FC, useMemo, useState } from "react"
import DropdownSearch from "./DropdownSearch"
import DropdownNoSearch from "./DropdownNoSearch"
import Modal from "./Modal"
import { useCarDetailsContext } from "@/store/CarContextProvider"
import { CarCoupe, CarModificationData } from "@/lib/_generated/graphql_sdk"

type ModificationFormProps = {
  brandId: string
  modelId: string
}

const ModificationForm: FC<ModificationFormProps> = ({brandId, modelId}) => {
  const {data, deleteCarModification, addCarModifications} = useCarDetailsContext()

  const defaultCarModification: CarModificationData = {
    id:'',
    name: '',
    coupe: undefined,
    horsePower: 0,
    weight: 0
  }

  const [selectedCoupe, setSelectedCoupe] =  useState<CarCoupe | string>('')
  const [selectedModification, setSelectedModification] =  useState<CarModificationData>(defaultCarModification)
  const [horsepower, setHorsepower] =  useState<number>(0)
  const [weight, setWeight] =  useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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

  const handleModalInputChnge = (value: {id: string; name: string}) => {
    setSelectedModification(value)
  }

  const clearModalInput = () => {
    setSelectedModification({id: '', name: ''})
  }

  const handleHorsepowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHorsepower(Number(e.target.value))
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(e.target.value))
  }


  return (
            
    <div className="flex flex-col justify-between items-center">
    <div className="flex flex-row w-64 ml-1 z-30">
    <DropdownSearch
      title='modification name'
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
    {isModalOpen && <Modal
      title={'Edit Modal'}
      subTitle="Edit modification name"
      closeFn={() => setIsModalOpen(false)}
      inputData={{id: selectedModification.id, name: selectedModification.name || ''}}
      onInputChange={handleModalInputChnge}
      clearInput={clearModalInput}
      editFn={() => console.log('edit modification ===>')}
      deleteFn={deleteCarModification}
      />
    }
      <DropdownNoSearch
        title='car coupe'
        dropdownLabel="Select a coupe"
        listItems={Object.values(CarCoupe)}
        selectedItem={selectedModificationDetails.coupe || ''}
        handleSelection={setSelectedCoupe}
        disabled={selectedModification.id === ''}
     />
      <div className="flex flex-col w-64 mt-6 ">
        <label className="uppercase text-sm">Horsepower</label>
        <input
          placeholder={'0'}
          value={selectedModificationDetails.horsePower || horsepower}
          onChange={handleHorsepowerChange}
          className={`w-full px-3 py-2 mr-1 focus:outline-none text-black border border-white rounded ${!selectedModification.name && "bg-violet-200"}`}
          disabled={!selectedModification.name}
        />
      </div>
      <div className="flex flex-col w-64 mt-6">
        <label className="uppercase text-sm">Weight</label>
        <input
          placeholder={'0'}
          value={selectedModificationDetails.weight || weight}
          onChange={handleWeightChange}
          className={`w-full px-3 py-2 ml-1 focus:outline-none text-black border border-white rounded ${!selectedModification.name && "bg-violet-200"}`}
          disabled={!selectedModification.name}
        />
      </div>
   </div>
  )
}

export default ModificationForm