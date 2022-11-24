import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  IAuthData,
  IAuthSignIn,
  IAuthSignUpConfirm,
  IAuthSignUpDoctor,
  IAuthSignUpPatient,
  IConfirmEmail,
  IConfirmEmailResponse,
} from '~models/auth.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Auth'],
  endpoints: (build) => ({
    postAuthSignIn: build.mutation<IAuthData, IAuthSignIn>({
      query: (queryArg) => ({ url: 'sign-in', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthSignUpDoctor: build.mutation<null, IAuthSignUpDoctor>({
      query: (queryArg) => ({ url: 'doctor/sign-up', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthSignUpPatient: build.mutation<null, IAuthSignUpPatient>({
      query: (queryArg) => ({ url: 'patient/sign-up', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthSignUpConfirm: build.mutation<null, IAuthSignUpConfirm>({
      query: (queryArg) => ({ url: 'sign-up/confirm', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthSignUpResendCode: build.mutation<IConfirmEmailResponse, IConfirmEmail>({
      query: (queryArg) => ({ url: 'sign-up/resend-code', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  usePostAuthSignInMutation,
  usePostAuthSignUpDoctorMutation,
  usePostAuthSignUpPatientMutation,
  usePostAuthSignUpConfirmMutation,
  usePostAuthSignUpResendCodeMutation,
} = authApi
