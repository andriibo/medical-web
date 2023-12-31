import { createApi } from '@reduxjs/toolkit/dist/query/react'

import {
  ICaregiverProfile,
  IDoctorPatients,
  IDoctorProfile,
  IPatientCaregivers,
  IPatientDoctors,
  IPatientProfile,
  IUpdateCaregiverProfile,
  IUpdateDoctorProfile,
  IUpdatePatientProfile,
} from '~models/profie.model'
import { staggeredBaseQueryWithBailOut } from '~stores/helpers/staggered-base-query-with-bail-out'

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: staggeredBaseQueryWithBailOut(''),
  tagTypes: ['Profile'],
  endpoints: (build) => ({
    getMyPatientProfile: build.query<IPatientProfile, void>({
      query: () => ({
        url: 'patient/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    patchMyPatientProfile: build.mutation<null, IUpdatePatientProfile>({
      query: (queryArg) => ({ url: 'patient/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    getMyDoctors: build.query<IPatientDoctors[], void>({
      query: () => ({ url: 'patient/my-doctors' }),
      providesTags: ['Profile'],
    }),
    getMyCaregivers: build.query<IPatientCaregivers[], void>({
      query: () => ({ url: 'patient/my-caregivers' }),
      providesTags: ['Profile'],
    }),
    getMyCaregiverProfile: build.query<ICaregiverProfile, void>({
      query: () => ({
        url: 'caregiver/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    getMyDoctorProfile: build.query<IDoctorProfile, void>({
      query: () => ({
        url: 'doctor/my-profile',
      }),
      providesTags: ['Profile'],
    }),
    patchMyDoctorProfile: build.mutation<null, IUpdateDoctorProfile>({
      query: (queryArg) => ({ url: 'doctor/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    patchMyCaregiverProfile: build.mutation<null, IUpdateCaregiverProfile>({
      query: (queryArg) => ({ url: 'caregiver/my-profile', method: 'PATCH', body: { ...queryArg } }),
      invalidatesTags: ['Profile'],
    }),
    getMyPatients: build.query<IDoctorPatients[], void>({
      query: () => ({ url: 'profile/my-patients' }),
      providesTags: ['Profile'],
    }),
    getPatientProfile: build.query<IDoctorPatients, { patientUserId: string }>({
      query: ({ patientUserId }) => ({ url: `patient-profile/${patientUserId}` }),
      providesTags: ['Profile'],
    }),
    postAvatar: build.mutation<null, FormData>({
      query: (body) => ({
        url: 'avatar/upload',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    patchDeleteMyAccount: build.mutation<null, void>({
      query: () => ({ url: 'my-profile/delete', method: 'PATCH' }),
      invalidatesTags: ['Profile'],
    }),
    patchRecoveryMyAccount: build.mutation<null, void>({
      query: () => ({ url: 'my-profile/recovery', method: 'PATCH' }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useGetMyPatientProfileQuery,
  usePatchMyPatientProfileMutation,
  useGetMyDoctorsQuery,
  useGetMyCaregiversQuery,
  useGetMyCaregiverProfileQuery,
  useGetMyDoctorProfileQuery,
  usePatchMyDoctorProfileMutation,
  usePatchMyCaregiverProfileMutation,
  useGetPatientProfileQuery,
  useGetMyPatientsQuery,
  usePostAvatarMutation,
  usePatchDeleteMyAccountMutation,
  usePatchRecoveryMyAccountMutation,
} = profileApi
