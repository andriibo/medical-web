import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const vitalsApi = createApi({
  reducerPath: 'vitalsApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Vitals'],
  endpoints: (build) => ({
    // postPatientVitals: build.mutation<null, null>({
    //   query: (queryArg) => ({ url: '', method: 'POST', body: { ...queryArg } }),
    //   invalidatesTags: ['Vitals'],
    // }),
  }),
})

export const {} = vitalsApi
