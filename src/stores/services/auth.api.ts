import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

import {
  CommonResponse,
  PostAuthConfirmSignUp,
  PostAuthSignUpDoctorRequest,
  PostAuthSignUpPatientRequest,
} from '../types/auth.types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Auth'],
  endpoints: (build) => ({
    postAuthSignUpDoctor: build.mutation<CommonResponse, PostAuthSignUpDoctorRequest>({
      query: (queryArg) => ({ url: 'sign-up/doctor', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthSignUpPatient: build.mutation<CommonResponse, PostAuthSignUpPatientRequest>({
      query: (queryArg) => ({ url: 'sign-up/patient', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthConfirmSignUp: build.mutation<CommonResponse, PostAuthConfirmSignUp>({
      query: (queryArg) => ({ url: 'confirm-sign-up', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const { usePostAuthSignUpDoctorMutation, usePostAuthSignUpPatientMutation, usePostAuthConfirmSignUpMutation } =
  authApi
