import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/dist/query/react'

import { BASE_API } from '~constants/constants'
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

      if (result.error?.status === 401) {
        try {
          if (!refreshToken) {
            throw new Error('No refresh token')
          }

          if (Date.now() > accessTokenExpireTime * 1000) {
            throw new Error('The access token has expired')
          }

          const refreshResponse = await fetch(`${BASE_API}/refresh-token`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (!refreshResponse.ok) {
            const errorMessage = await refreshResponse.text()

            throw new Error(errorMessage)
          }

          const refreshData = await refreshResponse.json()

          api.dispatch(setAccessToken(refreshData))

          result = await handleFetchBaseQuery()
        } catch (err) {
          console.error(err)

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
