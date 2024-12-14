import {CombinedData, TableData, CombinedDataModels} from '@/types/carTypes'
import {CarModification, CarModificationData} from '@/lib/_generated/graphql_sdk'

export const handleTableData = (data: CombinedData[] ) => {
  return data.flatMap(car => {
    
     return car.models.flatMap((model): TableData[]  => {
      if(model.modifications.length === 0) {
        return [{
          id: car.brand.id,
          brand: car.brand.name,
          model: model.name,
          modification: null,
          coupe: null,
          horsepower: null,
          weight: null
        }];
      } else {
        return model.modifications.map((modelMod): TableData => {
          return {
            id: car.brand.id,
            brand: car.brand.name,
            model: model.name,
            modification: modelMod.name,
            coupe: modelMod.coupe,
            horsepower: modelMod.horsePower,
            weight: modelMod.weight
          }
        })
      }
    })
  })
}

export const getCarModificationsByBrandModel = (data: CombinedData[], brandId: string, modelId: string): CombinedDataModels[] => {
  return data
          .filter((car) => car.brand.id.toString() === brandId.toString())
          .flatMap((model) => model.models.filter((mod) => mod.id.toString() === modelId.toString()))
}

export const getModificationNameId = (modifications: CarModification[]): {id: string, name: string}[] => {
  return modifications?.map((item) => ({
    id: item.id,
    name: item.name
  }))
}

export const getSelectedModificationDetails = (modifications: CarModificationData[], selectedModId: string, defaultModification: CarModificationData): CarModificationData => {
  return (
    modifications?.find((item) => item.id === selectedModId) || defaultModification
  )
}
