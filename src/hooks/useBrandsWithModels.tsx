import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphqlClient";
import { GET_CAR_BRANDS } from "@/lib/queries/carBrands";
import { GET_CAR_MODELS } from "@/lib/queries/carModels";
import { CarBrand, CarModel } from "@/lib/_generated/graphql_sdk";
import { GET_CAR_MODIFICATIONS } from "@/lib/queries/carModifications";
import { CarModification } from '@/types/carTypes'

export type CombinedResponse = {
  brand: CarBrand,
  models: {
    model: CarModel
    modifications: CarModification[]
  }[]
}

type AddCarBrandsResponse = {
  createCarBrand: CarBrand
}
type DeleteCarBrandsResponse = {
  deleteCarBrand: boolean
}
type EditCarBrandResponse = {
  editCarBrand: CarBrand
}
type CarBrandsResponse = {
  carBrands: CarBrand[]
}
type DeleteCarModelResponse = {
  deleteCarModel: boolean
}

type EditCarModelResponse = {
  editCarModel: CarModel
}
type AddCarModelResponse = {
  createCarModel: CarModel
}

const fetchCarBrands = async (): Promise<CarBrandsResponse> => {
  const response = graphqlClient.request<CarBrandsResponse>(GET_CAR_BRANDS)
  return response
}

const fetchCarModels = async (brandId: string): Promise<{ carModels: CarModel[] }> => {
  const response = graphqlClient.request<{ carModels: CarModel[] }>(GET_CAR_MODELS, { brandId })
  return response
}

const fetchCarModifications = async (modelId: string): Promise<{ carModifications: CarModification[] }> => {
  const response = graphqlClient.request<{ carModifications: CarModification[] }>(GET_CAR_MODIFICATIONS, { modelId })
  return response
}

export const useBrandsWithModels = () => {
  return useQuery<CombinedResponse[]>({
    queryKey: ['brandsWithModels'],
    queryFn: async () => {
      const {carBrands} = await fetchCarBrands()
      const brandsWithModels = await Promise.all(
        carBrands.map(async (brand) => {
          const {carModels} = await fetchCarModels(brand.id)

          const modelsWithModifications = await Promise.all(
            carModels.map(async (model) => {
              const {carModifications} = await fetchCarModifications(model.id)
              return {
                model,
                modifications: carModifications
              }
            })
          )
          return {brand, models: modelsWithModifications}
        })
      )
      
    return brandsWithModels
    }
  })
}