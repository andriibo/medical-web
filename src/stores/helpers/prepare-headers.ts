import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery'

import { RootState } from '~stores/store'

export const prepareHeaders: FetchBaseQueryArgs['prepareHeaders'] = (headers, { getState }) => {
  const state = getState() as RootState
  const { token } = state.auth.data

  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  return headers
}
