import { CarBrand, CarModel } from "@/lib/_generated/graphql_sdk"

type ModalProps<T> = {
  title: string
  subTitle: string
  closeFn: () => void
  inputData: T
  onInputChange: (value: T) => void
  clearInput: () => void
  editFn: (id: string, name: string) => void
  deleteFn: (id: string) => void
  onEditSuccess?: (updatedItem: CarBrand | Pick<CarModel, "id" | "name">) => void
}

const Modal = <T extends {id: string, name: string}>(props: ModalProps<T>) => {

  const {title, subTitle, closeFn, inputData, onInputChange, clearInput, editFn, deleteFn, onEditSuccess} = props

  return (
    <div className='fixed inset-0 bg-violet-500 bg-opacity-30 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg p-6 shadow-lg w-100'>
        <div className='flex justify-between text-lg font-semibold mb-1'>
          <h2>
            {title}
          </h2>
          <button onClick={closeFn}>X</button>
        </div>
        <p className='text-black-700 mb-4'>{`${subTitle}: ${inputData.name}`}</p>
      <div className='flex justify-between mb-4'>
        <input
            value={inputData.name}
            onChange={(e) => onInputChange({...inputData, name: e.target.value})}
            className='border border-black rounded p-2 w-full'
          />
      </div>
        <div className='flex justify-between mt-4'>
        <button
            onClick={async () => {
              await editFn(inputData.id.toString(), inputData.name),
              onEditSuccess && onEditSuccess(inputData)
            }}
            className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded w-full'
          >
            Edit item
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
  )

}

export default Modal