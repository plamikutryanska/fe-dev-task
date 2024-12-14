import { useReducer, useEffect, useCallback } from "react";
import { GraphQLClient } from "graphql-request";
import { GET_CAR_BRANDS, EDIT_CAR_BRAND, DELETE_CAR_BRAND, ADD_CAR_BRANDS } from "./queries/carBrands";
import { GET_CAR_MODELS, DELETE_CAR_MODEL, ADD_CAR_MODEL, EDIT_CAR_MODEL } from "./queries/carModels";
import { ADD_CAR_MODIFICATIONS, DELETE_CAR_MODIFICATIONS, GET_CAR_MODIFICATIONS, EDIT_CAR_MODIFICATIONS } from "./queries/carModifications";
import { CombinedData,CarModel } from "@/types/carTypes";
import { CarBrand, CarModification } from "./_generated/graphql_sdk";

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
  | { type: 'EDIT_CAR_MODEL'; model: CarModel}
  | { type: 'DELETE_CAR_MODIFICATION'; id: string}
  | { type: 'ADD_CAR_MODIFICATIONS'; modification: CarModification }
  | { type: 'EDIT_CAR_MODIFICATIONS', modification: CarModification}


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
    case 'EDIT_CAR_MODEL':
      const updatedModel = state.data.map((brand) => {
        if(brand.brand.id === action.model.brand.id){
          return {
            ...brand,
            models: brand.models.map((mod) => {
              if(mod.id === action.model.id){
                return {...mod, name: action.model.name}
              }
              return mod
            })
          }
        }
        return brand
      })
      return {
        ...state,
        data: updatedModel
      }
    case 'DELETE_CAR_MODIFICATION':
      return {
        ...state,
        data: state.data.map((item) => ({
          ...item,
          models: item.models.map((model) => ({
            ...model,
            modifications: model.modifications.filter((mod) => mod.id.toString() !== action.id)
          })) 
        }))
      }
    case 'ADD_CAR_MODIFICATIONS':
      return {
        ...state,
        data: state.data.map((brand) => ({
          ...brand,
          models: brand.models.map((model) =>
            model.id.toString() === action.modification.id
              ? {
                 ...model,
                  modifications: [...model.modifications, action.modification],
                  }
                : model
            ),
          })),
        };
        case 'EDIT_CAR_MODIFICATIONS': {
          if (!action.modification || !action.modification.id) {
            return state;
          }
          const updatedData = state.data.map((brand) => ({
            ...brand,
            models: brand.models.map((model) => ({
              ...model,
              modifications: model.modifications.map((mod) => 
                mod.id === action.modification.id ? {...mod, ...action.modification} : mod
              )
            }))
          }))
        
        return {
          ...state,
          data: updatedData
        }
      }
    default:
      throw new Error(`Unhandled request`)
  }
}


function useCarDetails(client: GraphQLClient) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchAllData = useCallback(async () => {
    dispatch({type: 'FETCH'});

    try {
      const {carBrands} = await client.request<{carBrands: CarBrand[]}>(GET_CAR_BRANDS)

      const carModelsPromise = carBrands.map((brand) => {
        return client.request<{carModels: CarModel[]}>(GET_CAR_MODELS, {brandId: brand.id})
      })

      const modelsResponse = await Promise.all(carModelsPromise)

      const flattenModelsResponse = modelsResponse.flatMap((res, brandIndex) => {
        return res.carModels.map((model) => ({
          ...model,
          brandIndex
        }))
      })

      const carModificationsPromise = flattenModelsResponse.map((res) => {
          return client.request<{carModifications: CarModification[]}>(GET_CAR_MODIFICATIONS, {modelId: res.id})
      })

      
      const modificationsResponse = await Promise.all(carModificationsPromise)

      const modelsWithModifications = flattenModelsResponse.map((model, index) => ({
        ...model,
        modifications: modificationsResponse[index].carModifications
      }))

      const combinedData: CombinedData[] = carBrands.map((brand, brandIndex) => ({
        brand,
        models: modelsWithModifications.filter((model) => model.brandIndex === brandIndex)
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

  const editCarModel = async (id: string, name: string) => {
    try {
      const response = await client.request<{editCarModel: CarModel}>(EDIT_CAR_MODEL, {data: {id, name}})
      const updatedModel = response.editCarModel
      dispatch({
        type: 'EDIT_CAR_MODEL', model: updatedModel
      })

      fetchAllData()

    } catch(error){
      dispatch({type: 'FETCH_ERROR', error: error as Error})
    }
  }

  const deleteCarModification = async (id: string) => {
    try{
      const response = await client.request<{deleteCarModification: boolean}>(DELETE_CAR_MODIFICATIONS, {id})

      if(response.deleteCarModification){
        dispatch({type: 'DELETE_CAR_MODIFICATION', id})
      }
    } catch(error){
      dispatch({type: 'FETCH_ERROR', error: error as Error})
    }
  }

  const addCarModifications = async (modelId: string, name: string) => {
    try {
      const response = await client.request<{ createCarModification: CarModification }>(
        ADD_CAR_MODIFICATIONS,
        { modelId, name }
      );
  
      const newModification = response.createCarModification;
  
      dispatch({
        type: 'ADD_CAR_MODIFICATIONS',
        modification: newModification,
      });

      fetchAllData()
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', error: error as Error });
      console.error('Error adding car modification:', error);
    }
  };

  const editCarModification = async (modificationData: CarModification) => {
    try {
      const { id, name, coupe, horsePower, weight } = modificationData;
      if (!id || !name) return;
  
      const response = await client.request<{ editCarModification: CarModification }>(
        EDIT_CAR_MODIFICATIONS,
        { data: { id, name, coupe, horsePower, weight } }
      );
      
      const updatedModification = response.editCarModification;
  
      dispatch({ type: 'EDIT_CAR_MODIFICATIONS', modification: updatedModification });
      fetchAllData();
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", error: error as Error });
    }
  };

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
    addCarModel,
    editCarModel,
    deleteCarModification,
    addCarModifications,
    editCarModification
  }
}

export default useCarDetails;

