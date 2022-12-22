import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  IAuthChangePassword,
  IAuthData,
  IAuthEmail,
  IAuthEmailResponse,
  IAuthForgotPasswordConfirm,
  IAuthSignIn,
  IAuthSignUpCaregiver,
  IAuthSignUpConfirm,
  IAuthSignUpDoctor,
  IAuthSignUpPatient,
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
    postAuthSignUpCaregiver: build.mutation<null, IAuthSignUpCaregiver>({
      query: (queryArg) => ({ url: 'caregiver/sign-up', method: 'POST', body: { ...queryArg } }),
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
    postAuthSignUpResendCode: build.mutation<IAuthEmailResponse, IAuthEmail>({
      query: (queryArg) => ({ url: 'sign-up/resend-code', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthForgotPassword: build.mutation<IAuthEmailResponse, IAuthEmail>({
      query: (queryArg) => ({ url: '/forgot-password', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthForgotPasswordConfirm: build.mutation<IAuthEmailResponse, IAuthForgotPasswordConfirm>({
      query: (queryArg) => ({ url: '/forgot-password/confirm', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthChangeEmail: build.mutation<IAuthEmailResponse, IAuthEmail>({
      query: (queryArg) => ({ url: '/change-email', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthChangeEmailConfirm: build.mutation<IAuthEmailResponse, { code: string }>({
      query: (queryArg) => ({ url: '/change-email/confirm', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
    postAuthChangePassword: build.mutation<null, IAuthChangePassword>({
      query: (queryArg) => ({ url: '/change-password', method: 'POST', body: { ...queryArg } }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  usePostAuthSignInMutation,
  usePostAuthSignUpDoctorMutation,
  usePostAuthSignUpCaregiverMutation,
  usePostAuthSignUpPatientMutation,
  usePostAuthSignUpConfirmMutation,
  usePostAuthSignUpResendCodeMutation,
  usePostAuthForgotPasswordMutation,
  usePostAuthForgotPasswordConfirmMutation,
  usePostAuthChangeEmailMutation,
  usePostAuthChangeEmailConfirmMutation,
  usePostAuthChangePasswordMutation,
} = authApi
