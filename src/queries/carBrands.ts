import { gql } from "graphql-request";

export const GET_CAR_BRANDS = gql`
  query CarBrands {
      carBrands {
          id
          name
      }
  }
`

export const ADD_CAR_BRANDS = gql`
  mutation CreateCarBrand($name: String!){
    createCarBrand(name: $name){
      id
      name
    }
  }
`

export const EDIT_CAR_BRAND = gql`
  mutation EditCarBrand($data: CarBrandData!) {
    editCarBrand(data: $data){
      id
      name
    }
  }
`

export const DELETE_CAR_BRAND = gql`
  mutation DeleteCarBrand($id: ID!) {
    deleteCarBrand(id: $id)
  }
`