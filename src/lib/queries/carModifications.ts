import { gql } from "graphql-request";

export const GET_CAR_MODIFICATIONS = gql`
  query CarModifications($modelId: ID!) {
    carModifications(modelId: $modelId) {
      id
      name
      coupe
      weight
      horsePower
    }
  }
`

export const DELETE_CAR_MODIFICATIONS = gql`
    mutation DeleteCarModification($id: ID!) {
    deleteCarModification(id: $id)
  }
`

export const ADD_CAR_MODIFICATIONS = gql`
    mutation CreateCarModification($modelId: ID!, $name: String!) {
    createCarModification(modelId: $modelId, name: $name){
      id
      name
      coupe
      weight
      horsePower
      model {
        id
        name
      }
    }
  }
`

export const EDIT_CAR_MODIFICATIONS = gql`
    mutation EditCarModification($data: CarModificationData!) {
      editCarModification(data: $data){
        id
        name
        coupe
        weight
        horsePower
        model {
          id
          name
        }
      }
  }
`