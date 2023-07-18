import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { ISpecialty } from '~models/specialty.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const specialtyApi = createApi({
  reducerPath: 'specialtyApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Specialty'],
  endpoints: (build) => ({
    getSpecialty: build.query<ISpecialty, void>({
      query: () => ({
        url: '/specialties',
      }),
      providesTags: ['Specialty'],
    }),
  }),
})

export const { useGetSpecialtyQuery } = specialtyApi
