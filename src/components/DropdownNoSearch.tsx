'use client'
import { useState } from "react"

type DropdownNoSearchProp = {
  title: string,
  dropdownLabel: string,
  listItems: string[],
  handleSelection: (e: any) => void,
  selectedItem: string,
  disabled?: boolean
}

const DropdownNoSearch = (prop: DropdownNoSearchProp) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="relative w-64 mt-6 flex flex-col h-12">
      <label className="uppercase text-sm">
        {prop.title}
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
          <ul className="max-h-80 overflow-y-auto w-full px-3 py-2 border-black rounded bg-white focus:outline-none shadow">
          {         
            prop.listItems.map((item, index) => {
              return (
              <li 
                key={`${item}-${index}`}
                value={item}
                onClick={() => {
                  prop.handleSelection(item);
                  setIsOpen(false)
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {item}
              </li>
              )
            })}
          </ul>
          </div>
        ) : (
          null
        )
      }
      </div>
  )  
}

export default DropdownNoSearch