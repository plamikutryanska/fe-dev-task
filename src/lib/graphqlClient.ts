import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_FRONTEND_GRAPTHQL_ENDPOINT ?? ""

export const graphqlClient = new GraphQLClient((endpoint))