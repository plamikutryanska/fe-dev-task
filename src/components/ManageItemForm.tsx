'use client'
import { FC, useEffect, useState } from "react"
import { CarBrand, CarModel } from '@lib/_generated/graphql_sdk'
import BrandAndModelsDropdown from "./BrandAndModelsDropdown"
import ModificationForm from "./ModificationForm"

type PartialCarModel = Pick<CarModel, "id" | "name">

const ManageItemForm: FC = () => {
  const [selectedBrand, setSelectedBrand] =  useState<CarBrand>({id:'', name: ''})
  const [selectedModel, setSelectedModel] =  useState<PartialCarModel>({id:'', name: ''})


  useEffect(() => {
    setSelectedModel({id:'', name: ''})
  },[selectedBrand])

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className='p-6 sm:p-8 sm:w-2/4 h-auto bg-violet-300 rounded'>
      <div className="h-8 uppercase font-bold">Car Brands</div>
      <div className="border-b border-black w-fill"/>
      <BrandAndModelsDropdown
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
      <ModificationForm brandId={selectedBrand.id} modelId={selectedModel.id} />
      </div>
    </div>
  )
}

export default ManageItemForm