import { useReducer, useEffect, useCallback } from "react";
import { GraphQLClient } from "graphql-request";
import { GET_CAR_BRANDS, EDIT_CAR_BRAND, DELETE_CAR_BRAND, ADD_CAR_BRANDS } from "./queries/carBrands";
import { GET_CAR_MODELS, DELETE_CAR_MODEL, ADD_CAR_MODEL } from "./queries/carModels";
import { GET_CAR_MODIFICATIONS } from "./queries/carModifications";
import { CombinedData, CarBrand, CarModifications,CarModel } from "@/types/carTypes";

interface State {
  loading: boolean;
  error: Error | null;
  data: CombinedData[]
}

type Action =
  | { type: 'FETCH' }
  | { type: 'FETCH_SUCCESS'; payload: CombinedData[] }
  | { type: 'FETCH_ERROR'; error: Error }
  | { type: 'ADD_CAR_BRAND'; brand: CarBrand}
  | { type: 'EDIT_CAR_BRAND'; brand: CarBrand}
  | { type: 'DELETE_CAR_BRAND'; id: string}
  | { type: 'DELETE_CAR_MODEL'; id: string}
  | { type: 'ADD_CAR_MODEL'; model: CarModel}


const initialState: State = {
  loading: false,
  error: null,
  data: []
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: null, data: action.payload};
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'ADD_CAR_BRAND':
      return { ...state, data: [...state.data, {brand: action.brand, models: []}]};
    case 'EDIT_CAR_BRAND':
      const updatedData = state.data.map((item) => {
        if(item.brand.id === action.brand.id){
          return {...item, brand: {...item.brand, name:action.brand.name}}
        }
        return item
      });
      return {
        ...state,
        data: updatedData

      }
    case 'DELETE_CAR_BRAND':
      return {
        ...state,
        data: state.data.filter((item) => item.brand.id.toString() !== action.id)
      }
    case 'DELETE_CAR_MODEL':
        return {
          ...state,
          data: state.data.filter((item) => item.models.filter((mod) => mod.id.toString() !== action.id))
        }
    case 'ADD_CAR_MODEL':
      return { 
        ...state,
        data: state.data.map((item) => {
          return item.brand.id === action.model.brand.id ? {
            ...item,
            models: [
              ...item.models,
              {...action.model, modifications: []}
            ]
          } : item
        })
      };
    default:
      throw new Error(`Unhandled request`)
  }
}


function useCarDetailsV2(client: GraphQLClient) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchAllData = useCallback(async () => {
    dispatch({type: 'FETCH'});

    try {
      const {carBrands} = await client.request<{carBrands: CarBrand[]}>(GET_CAR_BRANDS)

      const carModelsPromise = carBrands.map((brand) => {
        return client.request<{carModels: CarModel[]}>(GET_CAR_MODELS, {brandId: brand.id})
      })

      const modelsResponse = await Promise.all(carModelsPromise)

      const carModificationsPromise = modelsResponse.flatMap((res) => {
        return res.carModels.map((model) => {
          return client.request<{carModifications: CarModifications[]}>(GET_CAR_MODIFICATIONS, {modelId: model.id})
        })
      })

      const modificationsResponse = await Promise.all(carModificationsPromise)

      const combinedData: CombinedData[] = carBrands.map((brand, index) => ({
        brand,
        models: modelsResponse[index].carModels.map((model, modelIndex) => ({
          ...model,
          modifications: modificationsResponse[modelIndex].carModifications
        }))
      })
    
    )
      dispatch({type: "FETCH_SUCCESS", payload: combinedData})


    } catch (error){
      dispatch({type: "FETCH_ERROR", error: error as Error})
    }
  }, [client])

  const addCarBrand = async (name: string) => {
    try{
      const response = await client.request<{createCarBrand: CarBrand}>(ADD_CAR_BRANDS, {name})
      const newBrand = response.createCarBrand

      dispatch({type: 'ADD_CAR_BRAND', brand: newBrand})

      fetchAllData()

    } catch(error) {
      dispatch({type: 'FETCH_ERROR', error: error as Error})
    }
  }

  const editCarBrand = async (id: string, name: string) => {
    try {
      const response = await client.request<{editCarBrand: CarBrand}>(EDIT_CAR_BRAND, {data: {id, name}})
      const updatedBrand = response.editCarBrand

      dispatch({
        type: 'EDIT_CAR_BRAND', brand: {id: updatedBrand.id, name: updatedBrand.name}
      })

    } catch(error){
      dispatch({type: 'FETCH_ERROR', error: error as Error})
    }
  }

  const deleteCarBrand = async (id: string) => {
    try {
      const response = await client.request<{deleteCarBrand: {id: string}}>(DELETE_CAR_BRAND, {id})

      if(response.deleteCarBrand){
      dispatch({type: 'DELETE_CAR_BRAND', id})
      }

      fetchAllData()

    } catch(error){
      dispatch({type: 'FETCH_ERROR', error: error as Error})
    }
  }

  const deleteCarModel = async (id: string) => {
    try{
      const response = await client.request<{deleteCarModel: {id: string}}>(DELETE_CAR_MODEL, {id})

      if(response.deleteCarModel){
        dispatch({type: 'DELETE_CAR_MODEL', id})
      }

      fetchAllData()
    } catch(error){
      dispatch({type: 'FETCH_ERROR', error: error as Error})
    }
  }

  const addCarModel = async (brandId: string, name: string) => {
    try{
      const response = await client.request<{createCarModel: CarModel}>(ADD_CAR_MODEL, {brandId, name})
      const newModel = response.createCarModel

      dispatch({type: 'ADD_CAR_MODEL', model: newModel})

      fetchAllData()

    } catch(error){
      dispatch({type: 'FETCH_ERROR', error: error as Error})
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  return {
    ...state,
    fetchAllData,
    addCarBrand,
    editCarBrand,
    deleteCarBrand,
    deleteCarModel,
    addCarModel
  }
}

export default useCarDetailsV2;

