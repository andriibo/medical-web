import { Modify } from '~/types/modify.type'
import { ICaregiverProfile, IDoctorProfile, IPatientProfile } from '~models/profie.model'
import { IUserModel } from '~models/user.model'

export interface IAuthData {
  accessToken: string
  accessTokenExpireTime: string
  refreshToken: string
  user: IUserModel
}

export interface IAuthSignIn {
  email: string
  password: string
  rememberMe: boolean
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

export interface IAuthSignUpCaregiver extends ICaregiverProfile {
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

export interface IAuthChangePassword {
  currentPassword: string
  newPassword: string
}

export interface IAuthEmailResponse {
  attributeName: string
  deliveryMedium: string
  destination: string
}

export interface IAuthChangeEmailConfirm {
  code: string
}

export type AuthSignInKeys = keyof IAuthSignIn
export type AuthSignUpPatientKeys = keyof IAuthSignUpPatient
export type AuthSignUpDoctorKeys = keyof IAuthSignUpDoctor
export type AuthSignUpCaregiverKeys = keyof IAuthSignUpCaregiver
export type AuthSignUpConfirmKeys = keyof IAuthSignUpConfirm
export type AuthEmailKeys = keyof IAuthEmail
export type AuthForgotPasswordConfirmFormKeys = keyof IAuthForgotPasswordConfirmForm
export type AuthChangePasswordKeys = keyof IAuthChangePassword
export type AuthChangeEmailConfirmKeys = keyof IAuthChangeEmailConfirm
