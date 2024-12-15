'use client'
import { graphqlClient } from '@/lib/graphqlClient'
import { ADD_CAR_BRANDS, GET_CAR_BRANDS, DELETE_CAR_BRAND, EDIT_CAR_BRAND } from '@/queries/carBrands'
import { ADD_CAR_MODEL, GET_CAR_MODELS, DELETE_CAR_MODEL, EDIT_CAR_MODEL } from '@/queries/carModels'
import { GET_CAR_MODIFICATIONS, DELETE_CAR_MODIFICATIONS, ADD_CAR_MODIFICATIONS, EDIT_CAR_MODIFICATIONS } from '@/queries/carModifications'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { CarBrand, CarCoupe, CarModel } from '@/lib/_generated/graphql_sdk'
import { CombinedResponse } from './useBrandsWithModels'

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
type DeleteCarModificationResponse = {
  deleteCarModification: boolean
}
type AddCarModificationResponse = {
  createCarModification: CarModification
}
type EditCarModificationResponse = {
  editCarModification: CarModification
}
type CarModificationResponse = {
  carModification: CarModification[]
}

type CarModification = {
  id: string,
  name: string,
  coupe: CarCoupe,
  weight: number,
  horsePower: number
}


export const fetchCarBrands = async (): Promise<CarBrandsResponse> => {
  const response = graphqlClient.request<CarBrandsResponse>(GET_CAR_BRANDS)
  return response
}

export const useCarBrands = () => {
  return useQuery<CarBrandsResponse>({
    queryKey: ['carBrands'],
    queryFn: fetchCarBrands
  })
}

export const useAddCarBrand = () => {
  const queryClient = useQueryClient()

  return useMutation<CarBrand, Error, { name: string }>({
    mutationFn: async (newCar: { name: string }) => {
      const response = await graphqlClient.request<AddCarBrandsResponse>(
        ADD_CAR_BRANDS,
        newCar
      )
      return response.createCarBrand
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carBrands'] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }

  })
}

export const useDeleteCarBrand = () => {
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, { id: string }>({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await graphqlClient.request<DeleteCarBrandsResponse>(
        DELETE_CAR_BRAND,
        { id }
      )
      return response.deleteCarBrand
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carBrands'] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }
  })
}

export const useEditCarBrand = () => {
  const queryClient = useQueryClient()

  return useMutation<CarBrand, Error, { id: string, name: string }>({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const response = await graphqlClient.request<EditCarBrandResponse>(
        EDIT_CAR_BRAND,
        { data: { id, name } }
      )
      return response.editCarBrand
    },
    onSuccess: (updatedBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })

      queryClient.setQueryData<CombinedResponse[]>(['brandsWithModels'], (oldData) => {
        if (!oldData) return []

        return oldData.map((brandData) => {
          if (brandData.brand.id === updatedBrand.id) {
            return {
              ...brandData,
              brand: updatedBrand,
            }
          }
          return brandData
        })
      })
      console.log('Edit is successful')
    },
    onError: (error) => {
      console.log('Error editing: ', error)
    }
  })
}

export const fetchCarModels = async (brandId: string): Promise<{ carModels: CarModel[] }> => {
  const response = graphqlClient.request<{ carModels: CarModel[] }>(GET_CAR_MODELS, { brandId })
  return response
}

export const useCarModels = (brandId: string) => {
  return useQuery<{ carModels: CarModel[] }>({
    queryKey: ['carModels', brandId],
    queryFn: () => fetchCarModels(brandId)
  })
}

export const useAddCarModel = () => {
  const queryClient = useQueryClient()

  return useMutation<CarModel, Error, { brandId: string, name: string }>({
    mutationFn: async ({ brandId, name }) => {
      const response = await graphqlClient.request<AddCarModelResponse>(
        ADD_CAR_MODEL,
        { brandId, name }
      )
      return response.createCarModel
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carModels'] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }

  })
}

export const useDeleteCarModel = () => {
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, { id: string }>({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await graphqlClient.request<DeleteCarModelResponse>(
        DELETE_CAR_MODEL,
        { id }
      )
      return response.deleteCarModel
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carModels'] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }
  })
}

export const useEditCarModel = () => {
  const queryClient = useQueryClient()

  return useMutation<CarModel, Error, { id: string, name: string }>({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const response = await graphqlClient.request<EditCarModelResponse>(
        EDIT_CAR_MODEL,
        { data: { id, name } }
      )
      return response.editCarModel
    },
    onSuccess: (updatedModel) => {
      queryClient.invalidateQueries({ queryKey: ['carModels', updatedModel.id] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }
  })
}

export const useCarModifications = (modelId: string) => {
  return useQuery<CarModificationResponse>({
    queryKey: ['carModifications', modelId],
    queryFn: async () => {
      const response = await graphqlClient.request<CarModificationResponse>(GET_CAR_MODIFICATIONS, { modelId })
      return response
    },
    enabled: !modelId
  })
}

export const useAddCarModification = () => {
  const queryClient = useQueryClient()

  return useMutation<CarModification, Error, { modelId: string, name: string }>({
    mutationFn: async ({ modelId, name }) => {
      const response = await graphqlClient.request<AddCarModificationResponse>(
        ADD_CAR_MODIFICATIONS,
        { modelId, name }
      )
      return response.createCarModification
    },
    onSuccess: (_, { modelId }) => {
      queryClient.invalidateQueries({ queryKey: ['carModifications', modelId] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }
  })
}

export const useDeleteCarModification = () => {
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, { id: string, modelId: string }>({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await graphqlClient.request<DeleteCarModificationResponse>(
        DELETE_CAR_MODIFICATIONS,
        { id }
      )
      return response.deleteCarModification
    },
    onSuccess: (_, { modelId }) => {
      queryClient.invalidateQueries({ queryKey: ['carModifications', modelId] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }
  })
}

export const useEditCarModification = () => {
  const queryClient = useQueryClient()

  return useMutation<CarModification, Error, CarModification>({
    mutationFn: async (modification) => {
      const response = await graphqlClient.request<EditCarModificationResponse>(
        EDIT_CAR_MODIFICATIONS,
        { data: modification }
      )
      return response.editCarModification
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['carModifications', id] })
      queryClient.invalidateQueries({ queryKey: ['brandsWithModels'] })
    }
  })
}