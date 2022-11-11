import { GenderEnum } from '~/enums/gender.enum'

export type AuthDataResponse = {
  token: string
  tokenExpireTime: string
  user: {
    id: string
    email: string
    roles: string[]
  }
}

export type PostAuthSignInRequest = {
  email: string
  password: string
}

export type PostAuthSignUpDoctorRequest = {
  email: string
  firstName: string
  lastName: string
  phone: string
  institution: string
  password: string
}

export type PostAuthSignUpPatientRequest = {
  email: string
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: GenderEnum
  height: number
  weight: number
  password: string
}

type Modify<T, R> = Omit<T, keyof R> & R

export type PostAuthSignUpPatientForm = Modify<
  PostAuthSignUpPatientRequest,
  {
    gender: string
    height: string
    weight: string
  }
>

export type PostAuthConfirmSignUpRequest = {
  email: string
  code: string
}

export type PostAuthSignInRequestKeys = keyof PostAuthSignInRequest
export type PostAuthSignUpPatientRequestKeys = keyof PostAuthSignUpPatientRequest
export type PostAuthSignUpDoctorRequestKeys = keyof PostAuthSignUpDoctorRequest
export type PostAuthConfirmSignUpRequestKeys = keyof PostAuthConfirmSignUpRequest
