import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { ICreateMedication, IMedication } from '~models/medications.model'
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
    getPatientMedications: build.query<IMedication[], { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-medications/${patientUserId}`,
      }),
      providesTags: ['PatientMedication'],
    }),
    deletePatientMedication: build.mutation<null, { medicationId: string }>({
      query: ({ medicationId }) => ({ url: `patient-medication/${medicationId}`, method: 'DELETE' }),
      invalidatesTags: ['PatientMedication'],
    }),
  }),
})

export const { usePostPatientMedicationMutation, useGetPatientMedicationsQuery, useDeletePatientMedicationMutation } =
  patientMedicationApi
