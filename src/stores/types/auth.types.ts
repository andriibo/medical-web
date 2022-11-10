import { GenderEnum } from '~/enums/gender.enum'

export type CommonResponse = {
  success: boolean
  message: string
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
  dob: Date
  gender: GenderEnum
  height: number
  weight: number
  password: string
}
