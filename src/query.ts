import postgres from "@sio/postgres";
import {InferResult} from "kysely";

export const customersQuery = postgres
    .selectFrom('customer')
    .selectAll()

export type CustomersReturnType = InferResult<typeof customersQuery>
