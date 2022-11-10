import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react'

export function isSuccessfulRequest<T>(
  response?:
    | {
        data?: T
      }
    | {
        error: FetchBaseQueryError | SerializedError
      }
): response is {
  data: T
} {
  return (
    (
      response as {
        data: T
      }
    ).data !== undefined
  )
}
