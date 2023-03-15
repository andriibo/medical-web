import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery'

import { RootState } from '~stores/store'

export const prepareHeaders: FetchBaseQueryArgs['prepareHeaders'] = (headers, { getState }) => {
  const state = getState() as RootState
  const { accessToken } = state.auth.data

  headers.set('Authorization', `Bearer ${accessToken}`)
  headers.set('Accept', 'application/json')

  return headers
}
