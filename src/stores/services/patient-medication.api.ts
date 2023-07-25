import { createApi } from '@reduxjs/toolkit/dist/query/react'
import dayjs from 'dayjs'

import { ICreateMedication, IMedication, IUpdateMedication } from '~models/medications.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientMedicationApi = createApi({
  reducerPath: 'patientMedicationApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientMedication'],
  endpoints: (build) => ({
    postPatientMedication: build.mutation<null, ICreateMedication>({
      query: (queryArg) => ({ url: 'patient-medication', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['PatientMedication'],
    }),
    patchPatientMedication: build.mutation<null, IUpdateMedication>({
      query: ({ medicationId, medication }) => ({
        url: `patient-medication/${medicationId}`,
        method: 'PATCH',
        body: { ...medication },
      }),
      invalidatesTags: ['PatientMedication'],
    }),
    getPatientMedications: build.query<IMedication[], { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-medications/${patientUserId}`,
      }),
      transformResponse: (response: IMedication[]) =>
        response.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()),
      providesTags: ['PatientMedication'],
    }),
    deletePatientMedication: build.mutation<null, { medicationId: string }>({
      query: ({ medicationId }) => ({ url: `patient-medication/${medicationId}`, method: 'DELETE' }),
      invalidatesTags: ['PatientMedication'],
    }),
  }),
})

export const {
  usePostPatientMedicationMutation,
  usePatchPatientMedicationMutation,
  useGetPatientMedicationsQuery,
  useDeletePatientMedicationMutation,
} = patientMedicationApi
