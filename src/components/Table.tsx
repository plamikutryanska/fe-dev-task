'use client'

type TableData = Array<{ [key: string]: string | number | null }>

const Table = (data: {data: TableData}) => {
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
        data.data.map((item, index)  => {
          return (
            <tr
            key={`${item.id}-${index}`}
            className="border border-black-300 px-4 py-2  even:bg-violet-100"
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