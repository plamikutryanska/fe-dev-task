
import { CarBrand, CarCoupe } from "@/lib/_generated/graphql_sdk"

export interface CarModel {
  id: number
  name: string
  brand: CarBrand
}

export type CombinedDataModels = {
  modifications: CarModification[]
} & CarModel


export interface CombinedData {
  brand: CarBrand;
  models: CombinedDataModels[]
}

export type TableData = {
  id: string,
  brand: string,
  model: string,
  modification: string | null,
  coupe: CarCoupe | null,
  horsepower: number | null,
  weight: number | null
}

export type CarModification = {
  id: string,
  name: string,
  coupe: CarCoupe,
  weight: number,
  horsePower: number
}
