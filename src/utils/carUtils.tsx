import {TableData} from '@/types/carTypes'
import { CarBrand, CarModel } from '@/lib/_generated/graphql_sdk'
import { CarModification } from '@/types/carTypes'

type CombinedResponse = {
  brand: CarBrand,
  models: {
    model: CarModel
    modifications: CarModification[]
  }[]
}

export const handleTableData = (data: CombinedResponse[] ) => {
  return data.flatMap(car => {
    
    return car.models.flatMap((model): TableData[]  => {
     if(model.modifications.length === 0) {
       return [{
         id: car.brand.id,
         brand: car.brand.name,
         model: model.model.name,
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
           model: model.model.name,
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

export const getCarModificationsByBrandModel = (data: CombinedResponse[], brandId: string, modelId: string):{
  model: CarModel;
  modifications: CarModification[];
}[] => {
  return data
          .filter((car) => car.brand.id.toString() === brandId.toString())
          .flatMap((model) => model.models.filter((mod) => mod.model.id.toString() === modelId.toString()))
}

export const getModificationNameId = (modifications: CarModification[]): {id: string, name: string}[] => {
  return modifications?.map((item) => ({
    id: item.id,
    name: item.name
  }))
}

export const getSelectedModificationDetails = (modifications: CarModification[], selectedModId: string, defaultModification: CarModification): CarModification => {
  return (
    modifications?.find((item) => item.id === selectedModId) || defaultModification
  )
}
