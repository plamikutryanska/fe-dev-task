'use client'
import { useState } from "react"

type ListItems = {
  id: number
  name: string
}

type DropdownSearchProp = {
  title: string,
  dropdownLabel: string,
  listItems: ListItems[],
  handleSelection: (e: any) => void,
  selectedItem: string,
  createButtonFn: (args: {name: string, additionalParam?: string}) => void,
  createContext?: string,
  additionalParam?: string,
  disabled?: boolean
  isRequired?: boolean
}

const DropdownSearch = (prop: DropdownSearchProp) => {
  const [search, setSearch] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const searchedResult = prop.listItems?.filter(item => item.name.toLowerCase().includes(search.toLocaleLowerCase()))

  return (
    <div className="relative w-64 mt-6 flex flex-col h-12">
      <label className="uppercase text-sm">
        {prop.isRequired ? `${prop.title}*` : prop.title}
      </label>
      <button 
        className={`w-full px-3 py-2 border border-white rounded focus:outline-none ${prop.disabled ? "bg-violet-200" : "bg-white"}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={prop.disabled}
      >
        {prop.selectedItem === '' ? prop.dropdownLabel : prop.selectedItem}
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
            required={prop.isRequired}
      />
          <ul className="max-h-80 overflow-y-auto w-full px-3 py-2 border-black rounded bg-white focus:outline-none shadow">
          {searchedResult?.length > 0 ? (
            searchedResult.map((item) => {
              return (
              <li 
                key={`${item.id}`}
                value={item.name}
                onClick={() => {
                  prop.handleSelection(item);
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
                onClick={() => prop.createButtonFn({name: search.trim(), additionalParam: prop.disabled ? undefined : search.trim()})} 
                className={`mt-2 border border-black rounded px-4 py-1.5 cursor-pointer bg-black text-white ${search === "" && "bg-gray-300 cursor-not-allowed "}`}
                disabled={search === ""}
              >
                {`Create ${prop.createContext} +`}
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