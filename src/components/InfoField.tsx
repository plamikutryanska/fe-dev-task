import { FC } from "react";

type InfoFieldProps = {
  label: string;
  value: string | number
}

export const InfoField: FC<InfoFieldProps> = ({label, value}) => {
  return (
    <div className="flex flex-col w-64 mt-3 ">
      <label className="uppercase text-sm">{label}</label>
        <div className={`w-full px-3 py-2 mr-1 text-black bg-white rounded`}>
          {value}
        </div>
   </div>
  )
}