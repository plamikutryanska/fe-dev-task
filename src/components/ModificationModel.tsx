import { FC, useState } from "react";
import { CarModificationData } from "@/lib/_generated/graphql_sdk";

type ModalProps = {
  title: string;
  subTitle: string;
  closeFn: () => void;
  inputData: {
    id: string;
    name: string;
    horsePower: number;
    weight: number;
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
  const { id, name, horsePower, weight } = inputData;

  const [modifiedName, setModifiedName] = useState(name);
  const [modifiedHorsepower, setModifiedHorsepower] = useState(horsePower);
  const [modifiedWeight, setModifiedWeight] = useState(weight);

  const handleHorsepowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifiedHorsepower(Number(e.target.value));
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifiedWeight(Number(e.target.value));
  }

  const handleSave = () => {
    const updatedData = { id, name: modifiedName, horsePower: modifiedHorsepower, weight: modifiedWeight };
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
      <input
        value={modifiedName}
        onChange={(e) => {
          setModifiedName(e.target.value);
          onInputChange({ id, name: e.target.value });
        }}
        placeholder="Enter modification name"
        className='border border-black rounded p-2'
      />
      <div>
        <label className='flex justify-between text-sm font-semibold mb-1'>Horsepower</label>
        <input
          type="number"
          value={modifiedHorsepower}
          onChange={handleHorsepowerChange}
          min={50}
          placeholder="Horsepower"
          className='border border-black rounded p-2'
        />
      </div>
      <div>
        <label className='flex justify-between text-sm font-semibold mb-1'>Weight</label>
        <input
          type="number"
          value={modifiedWeight}
          onChange={handleWeightChange}
          min={500}
          placeholder="Weight"
          className='border border-black rounded p-2'
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
