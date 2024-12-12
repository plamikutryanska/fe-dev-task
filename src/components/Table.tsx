'use client'
import { FC } from "react"

type TableData = Array<{ [key: string]: string | number | null }>

type TableProps = {
  data: TableData
  tableTitle: string
  headerAbbreviations: Record<string, string>
}

const Table:FC<TableProps> = ({data, tableTitle, headerAbbreviations}) => {

  const handleTableHeaders = (): string[] => {
    return data.length ? Object.keys(data[0]) : []
  }

  const getAbbreviation = (header: string): string => {
    return headerAbbreviations[header] || header
  }

  return (
    <>
    <div className="text-9x1 font-bold uppercase">{tableTitle}</div>
    <table className="table-auto table-fixed border-collapse border border-black-300 w-full">
    <thead className="bg-black text-white">
      <tr>
        {handleTableHeaders().map(item => {
          return (
          <th key={item} className="border border-black-300 px-4 py-2 capitalize text-xs sm:text-sm">
            <span className="block md:hidden">
            {getAbbreviation(item)}
            </span>
            <span className="hidden md:block">
            {item}
            </span>
          </th>)
        })}
      </tr>
    </thead>
    </table>
    <div className="max-h-[424px] sm:max-h-[424px] lg:max-h-[624px] overflow-y-auto  shadow">
      <table className="table-auto table-fixed border-collapse border border-black-300 w-full text-[8px] sm:text-xs lg:text-bse">
      <tbody>
      {
          data.map((item, index)  => {
            return (
              <tr
              key={`${item.id}-${index}`}
              className="border border-black-300 px-4 py-2 even:bg-violet-100 text-[8px] sm:text-xs lg:text-bse"
              >
                {
                  Object.values(item).map((itemData, index) => {
                    return <td className="p-2 md:p-4" key={`${itemData}-${index}`}>{itemData}</td>
                  })
                }
            </tr>
            )
          })
        }
      </tbody>
      </table>
    </div>
    </>
  )
}

export default Table