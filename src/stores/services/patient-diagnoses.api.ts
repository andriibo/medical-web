import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IAuthSignUpDoctor } from '~models/auth.model'
import { ICreateDiagnoses, IDiagnoses } from '~models/diagnoses.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientDiagnosesApi = createApi({
  reducerPath: 'patientDiagnosesApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientDiagnoses'],
  endpoints: (build) => ({
    getPatientDiagnoses: build.query<IDiagnoses[], { patientUserId: string }>({
      query: ({ patientUserId }) => ({
        url: `patient-diagnoses/${patientUserId}`,
      }),
      providesTags: ['PatientDiagnoses'],
    }),
    postPatientDiagnoses: build.mutation<null, ICreateDiagnoses>({
      query: (queryArg) => ({ url: 'patient-diagnosis', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['PatientDiagnoses'],
    }),
    deletePatientDiagnoses: build.mutation<null, { diagnosisId: string }>({
      query: ({ diagnosisId }) => ({ url: `patient-diagnosis/${diagnosisId}`, method: 'DELETE' }),
      invalidatesTags: ['PatientDiagnoses'],
    }),
  }),
})

export const { useGetPatientDiagnosesQuery, usePostPatientDiagnosesMutation, useDeletePatientDiagnosesMutation } =
  patientDiagnosesApi
