'use client'
import { useState } from "react"

type DropdownSearchProp = {
  title: string,
  dropdownLabel: string,
  listItems: string[],
  handleSelection: (e: any) => void,
  selectedItem: string,
  isRequired?: boolean
}

const DropdownSearch = (prop: DropdownSearchProp) => {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const searchedResult = prop.listItems.filter(item => item.toLowerCase().includes(search.toLocaleLowerCase()))

  return (
    <div className="relative w-64 mt-6 flex flex-col">
      <label className="uppercase text-sm">
        {prop.isRequired ? `${prop.title}*` : prop.title}
      </label>
      <button 
        className="w-full px-3 py-2 border-black rounded bg-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
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
          <ul className="w-full px-3 py-2 border-black rounded bg-white focus:outline-none">
          {searchedResult.length > 0 ? (
            searchedResult.map((item, index) => {
              return (
              <li 
                key={index}
                value={item}
                onClick={() => {prop.handleSelection(item); setIsOpen(false)}}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {item}
              </li>
              )
            })
          ) : (
            <div className="flex-col justify-items-center">
              <div>{'no results found'}</div>
              <button
                onClick={() => console.log('MUST ADD ITEM TO LISTITEMS')} 
                className="mt-2 border border-black rounded px-4 py-1.5 cursor-pointer bg-black text-white"
              >
                {'Create +'}
              </button>
            </div>
          )
        }
          </ul>
          </div>
        ) : (
          <div className=" w-64 flex flex-col bg-blue"></div>
        )
      }
      </div>
  )  
}

export default DropdownSearch