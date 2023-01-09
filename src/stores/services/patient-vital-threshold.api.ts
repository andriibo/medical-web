import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  IThresholds,
  IThresholdsBloodPressure,
  IThresholdsCommon,
  IThresholdsSaturation,
} from '~models/threshold.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientVitalThresholdApi = createApi({
  reducerPath: 'patientVitalThresholdApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientVitalThreshold'],
  endpoints: (build) => ({
    patchPatientBloodPressure: build.mutation<null, { patientUserId: string; thresholds: IThresholdsBloodPressure }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/blood-pressure/${patientUserId}`,
        method: 'PATCH',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    patchPatientHeartRate: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/heart-rate/${patientUserId}`,
        method: 'PATCH',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    patchPatientMeanArterialPressure: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/mean-arterial-pressure/${patientUserId}`,
        method: 'PATCH',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    patchPatientTemperature: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/temperature/${patientUserId}`,
        method: 'PATCH',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    patchPatientSaturation: build.mutation<null, { patientUserId: string; thresholds: IThresholdsSaturation }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/oxygen-saturation/${patientUserId}`,
        method: 'PATCH',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    patchPatientRespirationRate: build.mutation<null, { patientUserId: string; thresholds: IThresholdsCommon }>({
      query: ({ patientUserId, thresholds }) => ({
        url: `doctor/respiration-rate/${patientUserId}`,
        method: 'PATCH',
        body: { ...thresholds },
      }),
      invalidatesTags: ['PatientVitalThreshold'],
    }),
    getMyVitalThresholds: build.query<IThresholds, void>({
      query: () => ({
        url: 'patient/my-vital-thresholds',
      }),
      providesTags: ['PatientVitalThreshold'],
    }),
    getPatientVirtualThresholds: build.query<IThresholds, { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-vital-thresholds/${patientUserId}`,
      }),
      providesTags: ['PatientVitalThreshold'],
    }),
  }),
})

export const {
  usePatchPatientBloodPressureMutation,
  usePatchPatientHeartRateMutation,
  usePatchPatientMeanArterialPressureMutation,
  usePatchPatientTemperatureMutation,
  usePatchPatientSaturationMutation,
  usePatchPatientRespirationRateMutation,
  useGetMyVitalThresholdsQuery,
  useGetPatientVirtualThresholdsQuery,
} = patientVitalThresholdApi
