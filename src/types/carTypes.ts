export interface CarBrand {
  id: number
  name: string
}

export interface CarModel {
  id: number
  name: string
  brand: CarBrand
}

export enum CarCoupe {
  Convertible = 'CONVERTIBLE',
  Coupe = 'COUPE',
  Hatchback = 'HATCHBACK',
  Sedan = 'SEDAN',
  Suv = 'SUV',
  Truck = 'TRUCK',
  Van = 'VAN',
  Wagon = 'WAGON',
}

export interface CarModifications {
  id: number
  name: string
  coupe: CarCoupe | null
  weight: number | null
  horsePower: number | null
}

export type CombinedDataModels = {
  modifications: CarModifications[]
} & CarModel


export interface CombinedData {
  brand: CarBrand;
  models: CombinedDataModels[]
}

export type TableData = {
  id: number,
  brand: string,
  model: string,
  modification: string | null,
  coupe: CarCoupe | null,
  horsepower: number | null,
  weight: number | null
}