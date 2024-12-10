import { gql } from "graphql-request"

export const GET_CAR_MODELS = gql`
  query CarModels($brandId: ID!) {
    carModels(brandId: $brandId) {
        id
        name
        brand {
          id
          name
        }
    }
}
`

export const DELETE_CAR_MODEL = gql`
    mutation DeleteCarModel($id: ID!) {
    deleteCarModel(id: $id)
  }
`
export const ADD_CAR_MODEL = gql`
  mutation CreateCarModel($brandId: ID!, $name: String!) {
    createCarModel(brandId: $brandId, name: $name){
      id
      name
      brand {
        id
        name
      }
    }
  }
`

export const EDIT_CAR_MODEL = gql`
  mutation EditCarModel($data: CarModelData!) {
    editCarModel(data: $data){
      id
      name
      brand {
        id
        name
      }
    }
  }
`