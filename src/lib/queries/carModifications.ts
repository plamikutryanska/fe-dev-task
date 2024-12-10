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