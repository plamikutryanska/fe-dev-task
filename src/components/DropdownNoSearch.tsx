'use client'
import { FC, useState } from "react"

type DropdownNoSearchProps = {
  title: string,
  dropdownLabel: string,
  listItems: string[],
  handleSelection: (e: any) => void,
  selectedItem: string,
  disabled?: boolean
}

const DropdownNoSearch: FC<DropdownNoSearchProps> = (props) => {
  const {title, dropdownLabel, listItems, handleSelection, selectedItem, disabled} = props
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="relative w-64 mt-2 flex flex-col h-12 w-full">
      <label className="uppercase text-sm">
        {title}
      </label>
      <button 
        className={`w-full px-3 py-2 border border-black rounded focus:outline-none`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedItem === '' ? dropdownLabel : selectedItem}
      </button>
      {
        isOpen ? (
          <div className="absolute mt-14 w-64 h-auto bg-white z-50">
          <ul className="max-h-52 overflow-y-auto w-full px-3 py-2 border-black rounded bg-white focus:outline-none shadow">
          {         
            listItems.map((item, index) => {
              return (
              <li 
                key={`${item}-${index}`}
                value={item}
                onClick={() => {
                  handleSelection(item);
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