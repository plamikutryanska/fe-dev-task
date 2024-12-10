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