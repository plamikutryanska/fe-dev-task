import { useReducer, useEffect } from "react";
import { GraphQLClient, gql } from "graphql-request";

interface CarBrand {
  id: number
  name: string
}

interface State {
  loading: boolean;
  error: Error | null;
  carBrands: CarBrand[]
}

type Action =
  | { type: 'FETCH' }
  | { type: 'FETCH_SUCCESS'; payload: CarBrand[] }
  | { type: 'FETCH_ERROR'; error: Error }
  | { type: 'ADD_BRAND'; payload: CarBrand }
  | { type: 'UPDATE_BRAND'; payload: CarBrand }
  | { type: 'DELETE_BRAND'; payload: string }



const client = new GraphQLClient('https://task_fe_demo.pfgbulgaria.com/graphql')

const GET_CAR_BRANDS = gql`
  query CarBrands {
      carBrands {
          id
          name
      }
  }
`

const ADD_CAR_BRANDS = gql`
  mutation AddCarBrand($name: String!){
    addCarBrand(name: $name){
      id
      name
    }
  }
`

const DELETE_CAR_BRANDS = gql`
  mutation DeleteCarBrand($id: ID!){
    deleteCarBrand(id: $id){
      id
    }
  }
`

const UPDATE_CAR_BRANDS = gql`
  mutation UpdateCarBrand($id: ID!, $name: String!){
    updateCarBrand(id: $id, name: $name){
      id
      name
    }
  }
`

const initialState: State = {
  loading: false,
  error: null,
  carBrands: []
}

const carBrandReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: null, carBrands: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'ADD_BRAND':
      return { ...state, carBrands: [...state.carBrands, action.payload] };
    case 'UPDATE_BRAND':
      return {
        ...state,
        carBrands: state.carBrands.map((brand: CarBrand) => {
          return brand.id === action.payload.id ? action.payload : brand
        })
      };
    //this may need work
    case 'DELETE_BRAND':
      return {
        ...state,
        carBrands: state.carBrands.filter((brand: CarBrand) => {
          return brand.id.toString() !== action.payload
        })
      }
    default:
      throw new Error(`Unhandled request`)
  }
}


function useCarDetails(client: GraphQLClient) {
  const [state, dispatch] = useReducer(carBrandReducer, initialState)

  const fetchData = async () => {
    dispatch({ type: 'FETCH' });
    try {
      const response = await client.request<{ carBrands: CarBrand[] }>(GET_CAR_BRANDS)
      dispatch({ type: 'FETCH_SUCCESS', payload: response.carBrands })
    } catch (error) {
      console.log('Error: ', error)
      dispatch({ type: 'FETCH_ERROR', error: error as Error })
    }
  }


  useEffect(() => {
    fetchData()
  }, [])

  return {
    ...state,
    fetchData
  }
}

export default useCarDetails;

