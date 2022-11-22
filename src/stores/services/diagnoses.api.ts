import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IDiagnosis } from '~models/diagnoses.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const diagnosesApi = createApi({
  reducerPath: 'diagnosesApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Diagnoses'],
  endpoints: (build) => ({
    getDiagnoses: build.query<IDiagnosis[], void>({
      query: () => ({
        url: 'diagnoses',
      }),
      providesTags: ['Diagnoses'],
    }),
  }),
})

export const { useGetDiagnosesQuery } = diagnosesApi
