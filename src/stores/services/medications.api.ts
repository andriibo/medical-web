import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IMedicationItem } from '~models/medications.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const medicationsApi = createApi({
  reducerPath: 'medicationsApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Medications'],
  endpoints: (build) => ({
    getMedications: build.query<IMedicationItem[], void>({
      query: () => ({
        url: 'medications',
      }),
      providesTags: ['Medications'],
    }),
  }),
})

export const { useGetMedicationsQuery } = medicationsApi
