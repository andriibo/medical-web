import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/dist/query/react'
import axios from 'axios'

import { BASE_API } from '~constants/constants'
import { IAccessToken } from '~models/auth.model'
import { prepareHeaders } from '~stores/helpers/prepare-headers'
import { clearPersist, setAccessToken } from '~stores/slices/auth.slice'
import { RootState } from '~stores/store'

export const staggeredBaseQueryWithBailOut = (path: string) =>
  retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const state = api.getState() as RootState
      const { refreshToken, accessTokenExpireTime } = state.auth.data

      const handleFetchBaseQuery = () =>
        fetchBaseQuery({ prepareHeaders, baseUrl: `${BASE_API}/${path}` })(args, api, extraOptions)

      let result = await handleFetchBaseQuery()

      if (result.error?.status === 401 && path !== 'auth/') {
        try {
          if (!refreshToken) {
            throw new Error('No refresh token')
          }

          if (Date.now() > accessTokenExpireTime * 1000) {
            throw new Error('The access token has been expired')
          }

          const response = await axios.post(`${BASE_API}/refresh-token`, { refreshToken })

          const data = response.data as IAccessToken

          api.dispatch(setAccessToken(data))

          result = await handleFetchBaseQuery()
        } catch (e) {
          console.error(e)

          api.dispatch(clearPersist())

          retry.fail(result.error)
        }
      }

      return result
    },
    {
      maxRetries: 0,
    },
  )
