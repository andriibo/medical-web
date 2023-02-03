import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientCategoryApi = createApi({
  reducerPath: 'patientCategoryApi',
  baseQuery: staggeredBaseQueryWithBailOut('patient-category'),
  tagTypes: ['PatientCategory'],
  endpoints: (build) => ({
    getPatientCategory: build.query<null, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `${patientUserId}`,
      }),
      providesTags: ['PatientCategory'],
    }),
    patchPatientCategoryNormal: build.mutation<null, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `normal/${patientUserId}`, method: 'PATCH' }),
      invalidatesTags: ['PatientCategory'],
    }),
    patchPatientCategoryBorderline: build.mutation<null, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `borderline/${patientUserId}`, method: 'PATCH' }),
      invalidatesTags: ['PatientCategory'],
    }),
  }),
})

export const {
  useGetPatientCategoryQuery,
  usePatchPatientCategoryNormalMutation,
  usePatchPatientCategoryBorderlineMutation,
} = patientCategoryApi
