import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/dist/query/react'

import { BASE_API } from '~constants/constants'
import { prepareHeaders } from '~stores/helpers/prepare-headers'
import { clearPersist } from '~stores/slices/auth.slice'

export const staggeredBaseQueryWithBailOut = (path: string) =>
  retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const result = await fetchBaseQuery({ prepareHeaders, baseUrl: `${BASE_API}/${path}` })(args, api, extraOptions)

      if (result.error?.status === 401 && path !== 'auth/') {
        api.dispatch(clearPersist())

        retry.fail(result.error)
      }

      return result
    },
    {
      maxRetries: 0,
    },
  )
