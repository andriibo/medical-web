import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { ICreateDiagnosis, IDiagnosis } from '~models/diagnoses.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientDiagnosisApi = createApi({
  reducerPath: 'patientDiagnosesApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientDiagnoses'],
  endpoints: (build) => ({
    postPatientDiagnosis: build.mutation<null, ICreateDiagnosis>({
      query: (queryArg) => ({ url: 'patient-diagnosis', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['PatientDiagnoses'],
    }),
    getPatientDiagnoses: build.query<IDiagnosis[], { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-diagnoses/${patientUserId}`,
      }),
      providesTags: ['PatientDiagnoses'],
    }),
    deletePatientDiagnosis: build.mutation<null, { diagnosisId: string }>({
      query: ({ diagnosisId }) => ({ url: `patient-diagnosis/${diagnosisId}`, method: 'DELETE' }),
      invalidatesTags: ['PatientDiagnoses'],
    }),
  }),
})

export const { usePostPatientDiagnosisMutation, useGetPatientDiagnosesQuery, useDeletePatientDiagnosisMutation } =
  patientDiagnosisApi
