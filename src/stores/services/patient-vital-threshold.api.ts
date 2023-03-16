import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  IThresholdsBloodPressure,
  IThresholdsCommon,
  IThresholdsData,
  IThresholdsSaturation,
} from '~models/threshold.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientVitalThresholdApi = createApi({
  reducerPath: 'patientVitalThresholdApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientVitalThreshold'],
  endpoints: (build) => ({
    postPatientBloodPressure: build.mutation<null, { patientUserId: string; thresholds: IThresholdsBloodPressure }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/blood-pressure/${patientUserId}`,
        method: 'POST',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    postPatientHeartRate: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/heart-rate/${patientUserId}`,
        method: 'POST',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    postPatientMeanArterialPressure: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/mean-arterial-pressure/${patientUserId}`,
        method: 'POST',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    postPatientTemperature: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/temperature/${patientUserId}`,
        method: 'POST',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    postPatientSaturation: build.mutation<null, { patientUserId: string; thresholds: IThresholdsSaturation }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/oxygen-saturation/${patientUserId}`,
        method: 'POST',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    postPatientRespirationRate: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/respiration-rate/${patientUserId}`,
        method: 'POST',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    getMyVitalThresholds: build.query<IThresholdsData, void>({
      query: () => ({
        url: 'patient/my-vital-thresholds',
      }),
      providesTags: ['PatientVitalThreshold'],
    }),
    getPatientVirtualThresholds: build.query<IThresholdsData, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-vital-thresholds/${patientUserId}`,
      }),
      providesTags: ['PatientVitalThreshold'],
    }),
  }),
})

export const {
  usePostPatientBloodPressureMutation,
  usePostPatientHeartRateMutation,
  usePostPatientMeanArterialPressureMutation,
  usePostPatientTemperatureMutation,
  usePostPatientSaturationMutation,
  usePostPatientRespirationRateMutation,
  useGetMyVitalThresholdsQuery,
  useGetPatientVirtualThresholdsQuery,
} = patientVitalThresholdApi
