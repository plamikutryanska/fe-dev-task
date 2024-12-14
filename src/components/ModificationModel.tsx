import { FC, SetStateAction, useState, Dispatch } from "react";
import { CarCoupe, CarModificationData, InputMaybe } from "@/lib/_generated/graphql_sdk";
import DropdownNoSearch from "./DropdownNoSearch";

type ModalProps = {
  title: string;
  subTitle: string;
  closeFn: () => void;
  inputData: {
    id: string;
    name: string;
    horsePower: number;
    weight: number;
    coupe: InputMaybe<CarCoupe> | undefined
  };
  onInputChange: (value: { id: string; name: string }) => void;
  clearInput: () => void;
  editFn: (modificationData: CarModificationData) => void;
  deleteFn: (id: string) => void;
};

const ModificationModel: FC<ModalProps> = ({
  title,
  subTitle,
  closeFn,
  inputData,
  onInputChange,
  clearInput,
  editFn,
  deleteFn
}) => {
  const { id, name, horsePower, weight, coupe } = inputData;

  const [modifiedName, setModifiedName] = useState(name);
  const [modifiedHorsepower, setModifiedHorsepower] = useState<number>(horsePower);
  const [modifiedWeight, setModifiedWeight] = useState<number>(weight);
  const [selectedCoupe, setSelectedCoupe] = useState<InputMaybe<CarCoupe> | undefined>(coupe)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, updater: Dispatch<SetStateAction<number>>) => {
    updater(Number(e.target.value));
  }

  const handleSave = () => {
    const updatedData: CarModificationData = { id, name: modifiedName, horsePower: modifiedHorsepower, weight: modifiedWeight, coupe: selectedCoupe };
    editFn(updatedData);
  }

  return (
    <div className='fixed inset-0 bg-violet-500 bg-opacity-30 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg p-6 shadow-lg w-100'>
      <div className='flex justify-between text-lg font-semibold mb-1'>
      <h2>{title}</h2>
      <button onClick={closeFn}>X</button>
      </div>
      <p  className='text-black-700 mb-2'>{subTitle}</p>
      <label className="uppercase text-sm">Name</label>
      <input
        value={modifiedName}
        onChange={(e) => {
          setModifiedName(e.target.value);
          onInputChange({ id, name: e.target.value });
        }}
        placeholder="Enter modification name"
        className='border border-black rounded p-2 w-full'
      />
      <div>
      <DropdownNoSearch
          title={'coupe'}
          dropdownLabel={'select a car coupe'}
          listItems={Object.values(CarCoupe)}
          handleSelection={(item) => setSelectedCoupe(item as CarCoupe)}
          selectedItem={selectedCoupe ?? ''}
      />
      </div>
      <div className="mt-4">
        <label className="uppercase text-sm">Horsepower</label>
        <input
          type="number"
          value={modifiedHorsepower}
          onChange={(e) => handleInputChange(e, setModifiedHorsepower)}
          min={50}
          placeholder="Horsepower"
          className='border border-black rounded p-2 w-full'
        />
      </div>
      <div>
        <label className="uppercase text-sm">Weight</label>
        <input
          type="number"
          value={modifiedWeight}
          onChange={(e) => handleInputChange(e, setModifiedWeight)}
          min={500}
          placeholder={weight.toString()}
          className='border border-black rounded p-2 w-full'
        />
      </div>


      <div className="flex justify-between mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded w-full"
        >
          Save
        </button>
        <button
          onClick={() => {deleteFn(inputData.id.toString()), clearInput()}}
          className='px-4 py-2 w-fit bg-red-500 text-white rounded hover:bg-red-600 w-full'
          >
            Delete
        </button>
      </div>
      </div>
    </div>
  );
};

export default ModificationModel;
