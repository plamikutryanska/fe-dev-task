'use client'
import {useRouter} from "next/navigation"


type TableData = Array<{ [key: string]: string | number }>

const Table = (data: {data: TableData}) => {

  const router = useRouter()

  //this needs to take in a pop to make the path dynamic
  const handleRowClick = () => {
    router.push('/edit')
  }

  const handleTableHeaders = () => {
    return data.data.length ? Object.keys(data.data[0]) : []
  }

  return (
    <>
    <div className="text-9x1 font-bold uppercase">{'Car Details'}</div>
    <table className="table-auto border-collapse border border-black-300 w-full">
    <thead className="bg-black text-white">
      <tr>
        {handleTableHeaders().map(item => {
          return <th className="border border-black-300 px-4 py-2 capitalize">{item}</th>
        })}
      </tr>
    </thead>
    <tbody>
      {
        data.data.map((item)  => {
          return (
            <tr
            key={item.id}
            className="border border-black-300 px-4 py-2 cursor-pointer hover:bg-violet-100"
            // onClick={() => handleRowClick()}
            >
              {
                Object.values(item).map(itemData => {
                  return <td className="p-2">{itemData}</td>
                })
              }
          </tr>
          )
        })
      }
    </tbody>
    </table>
    </>
  )
}

export default Table