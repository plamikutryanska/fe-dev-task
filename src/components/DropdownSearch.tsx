'use client'
import { FC, useState } from "react"

type ListItems = {
  id: string | number
  name: string
}

type DropdownSearchProps = {
  title: string,
  dropdownLabel: string,
  listItems: ListItems[],
  handleSelection: (e: any) => void,
  selectedItem: string,
  createButtonFn: (args: {name: string, additionalParam?: string, additionalParamsV2?: Record<string, any>}) => void,
  createContext?: string,
  additionalParam?: string,
  disabled?: boolean
  isRequired?: boolean
}

const DropdownSearch: FC<DropdownSearchProps> = (props) => {
  const {
    title,
    dropdownLabel,
    listItems,
    handleSelection,
    selectedItem,
    createButtonFn,
    createContext,
    additionalParam,
    disabled,
    isRequired
  } = props

  const [search, setSearch] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const searchedResult = listItems?.filter(item => item.name.toLowerCase().includes(search.toLocaleLowerCase()))

  return (
    <div className="relative w-64 mt-6 flex flex-col h-12">
      <label className="uppercase text-sm">
        {isRequired ? `${title}*` : title}
      </label>
      <button 
        className={`w-full px-3 py-2 border border-white rounded focus:outline-none ${disabled ? "bg-violet-200" : "bg-white"}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedItem === '' ? dropdownLabel : selectedItem}
      </button>
      {
        isOpen ? (
          <div className="absolute mt-14 w-64 h-auto bg-white z-50">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-3 py-2 focus:outline-none text-black"
            required={isRequired}
      />
          <ul className="max-h-80 overflow-y-auto w-full px-3 py-2 border-black rounded bg-white focus:outline-none shadow">
          {searchedResult?.length > 0 ? (
            searchedResult.map((item) => {
              return (
              <li 
                key={`${item.id}`}
                value={item.name}
                onClick={() => {
                  handleSelection(item);
                  setIsOpen(false)
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {item.name}
              </li>
              )
            })
          ) : (
            <div className="flex-col justify-items-center">
              <div className="text-lg">{'no results found'}</div>
              <div className="text-xs text-center font-bold">{'type name in search box to be able to create'}</div>
              <button
                onClick={() => createButtonFn({name: search.trim(), additionalParam: disabled ? undefined : search.trim()})} 
                className={`mt-2 border border-black rounded px-4 py-1.5 cursor-pointer bg-black text-white ${search === "" && "bg-gray-300 cursor-not-allowed "}`}
                disabled={search === ""}
              >
                {`Create ${createContext} +`}
              </button>
            </div>
          )
        }
          </ul>
          </div>
        ) : (
          null
        )
      }
      </div>
  )  
}

export default DropdownSearch