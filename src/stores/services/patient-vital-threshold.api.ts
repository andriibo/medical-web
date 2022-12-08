import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IThresholdModel } from '~models/threshold.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientVitalThresholdApi = createApi({
  reducerPath: 'patientVitalThresholdApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientVitalThreshold'],
  endpoints: (build) => ({
    getMyVitalThresholds: build.query<IThresholdModel[], void>({
      query: () => ({
        url: 'patient/my-vital-thresholds',
      }),
      providesTags: ['PatientVitalThreshold'],
    }),
    getPatientVirtualThresholds: build.query<IThresholdModel[], { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-vital-thresholds/${patientUserId}`,
      }),
      providesTags: ['PatientVitalThreshold'],
    }),
  }),
})

export const {
  useGetMyVitalThresholdsQuery,
  useLazyGetMyVitalThresholdsQuery,
  useGetPatientVirtualThresholdsQuery,
  useLazyGetPatientVirtualThresholdsQuery,
} = patientVitalThresholdApi
