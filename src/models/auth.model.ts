import { Modify } from '~/types/modify.type'
import { IDoctorProfile, IPatientProfile } from '~models/profie.model'

export interface IAuthData {
  token: string
  tokenExpireTime: string
  user: {
    id: string
    email: string
    roles: string[]
  }
}

export interface IAuthSignIn {
  email: string
  password: string
}

export interface IAuthSignUpPatient extends IPatientProfile {
  password: string
}

export interface IAuthSignUpPatientForm
  extends Modify<
    IAuthSignUpPatient,
    {
      gender: string
      height: number | string
      weight: number | string
    }
  > {}

export interface IAuthSignUpDoctor extends IDoctorProfile {
  password: string
}

export type IAuthSignUpConfirm = {
  email: string
  code: string
}

export type IAuthSignInKeys = keyof IAuthSignIn
export type IAuthSignUpPatientKeys = keyof IAuthSignUpPatient
export type IAuthSignUpDoctorKeys = keyof IAuthSignUpDoctor
export type IAuthSignUpConfirmKeys = keyof IAuthSignUpConfirm
