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

export interface IAuthSignUpConfirm {
  email: string
  code: string
}

export interface IAuthForgotPasswordConfirm {
  email: string
  code: string
  newPassword: string
}

export interface IAuthForgotPasswordConfirmForm extends Omit<IAuthForgotPasswordConfirm, 'email'> {}

export interface IAuthEmail {
  email: string
}

export interface IAuthEmailResponse {
  attributeName: string
  deliveryMedium: string
  destination: string
}

export type AuthSignInKeys = keyof IAuthSignIn
export type AuthSignUpPatientKeys = keyof IAuthSignUpPatient
export type AuthSignUpDoctorKeys = keyof IAuthSignUpDoctor
export type AuthSignUpConfirmKeys = keyof IAuthSignUpConfirm
export type AuthEmailKeys = keyof IAuthEmail
export type AuthForgotPasswordConfirmFormKeys = keyof IAuthForgotPasswordConfirmForm
