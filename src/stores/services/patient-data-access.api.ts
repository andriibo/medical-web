import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { IDataAccessEmail } from '~models/data-access.model'
import { ICreateDiagnosis, IDiagnosis } from '~models/diagnoses.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const patientDataAccessApi = createApi({
  reducerPath: 'patientDataAccessApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['PatientDataAccess'],
  endpoints: (build) => ({
    postPatientDataAccessInitiate: build.mutation<null, IDataAccessEmail>({
      query: (queryArg) => ({ url: 'patient/data-access/initiate', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['PatientDataAccess'],
    }),
  }),
})

export const { usePostPatientDataAccessInitiateMutation } = patientDataAccessApi
