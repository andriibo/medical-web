import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

import {
  AuthDataResponse,
  PostAuthConfirmSignUpRequest,
  PostAuthSignInRequest,
  PostAuthSignUpDoctorRequest,
  PostAuthSignUpPatientRequest,
} from '../types/auth.types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Auth'],
  endpoints: (build) => ({
    postAuthSignIn: build.mutation<AuthDataResponse, PostAuthSignInRequest>({
      query: (queryArg) => ({ url: 'sign-in', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthSignUpDoctor: build.mutation<null, PostAuthSignUpDoctorRequest>({
      query: (queryArg) => ({ url: 'sign-up/doctor', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthSignUpPatient: build.mutation<null, PostAuthSignUpPatientRequest>({
      query: (queryArg) => ({ url: 'sign-up/patient', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthConfirmSignUp: build.mutation<null, PostAuthConfirmSignUpRequest>({
      query: (queryArg) => ({ url: 'confirm-sign-up', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  usePostAuthSignInMutation,
  usePostAuthSignUpDoctorMutation,
  usePostAuthSignUpPatientMutation,
  usePostAuthConfirmSignUpMutation,
} = authApi
