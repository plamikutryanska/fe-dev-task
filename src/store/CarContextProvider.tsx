'use client'
import React, {createContext, ReactNode, useContext} from 'react'
import { GraphQLClient } from 'graphql-request'
import useCarDetailsV2 from '@/lib/useCarDetails'
import { CombinedData } from '../types/carTypes'

export interface CarContextType {
  data: CombinedData[],
  loading: boolean,
  error: Error | null,
  fetchAllData: () => void,
  addCarBrand: (name: string) => Promise<void>,
  editCarBrand: (id: string, name: string) => Promise<void>
  deleteCarBrand: (id: string) => Promise<void>,
  deleteCarModel: (id: string) => Promise<void>,
  addCarModel: (brandId: string, name: string) => Promise<void>,
  editCarModel: (brandId: string, name: string) => Promise<void>,
  deleteCarModification: (id: string) => Promise<void>,
  addCarModifications: ( modelId: string, name: string) => Promise<void>
}

interface CarProviderProps {
  children: ReactNode
}

export const CarContext = createContext<CarContextType | undefined>(undefined)

const client = new GraphQLClient('https://task_fe_demo.pfgbulgaria.com/graphql')

export const CarProvider: React.FC<CarProviderProps> = ({children}) => {

  const {
    data,
    fetchAllData,
    loading,
    error,
    addCarBrand,
    editCarBrand,
    deleteCarBrand,
    deleteCarModel,
    addCarModel,
    editCarModel,
    deleteCarModification,
    addCarModifications
  } = useCarDetailsV2(client)

  return (
    <CarContext.Provider 
      value={{
        data,
        loading,
        error,
        fetchAllData,
        addCarBrand,
        editCarBrand,
        deleteCarBrand,
        deleteCarModel,
        addCarModel,
        editCarModel,
        deleteCarModification,
        addCarModifications
      }}>
      {children}
    </CarContext.Provider>
  )
}

export const useCarDetailsContext = () => {
  const context = useContext(CarContext)

  if(context === undefined) {
    throw new Error()
  }
  return context
}


