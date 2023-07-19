import { GenderKeys } from '~/enums/gender.enum'
import { PatientStatus } from '~/enums/patient-status.enum'
import { CaregiverRoleLabelKeys, DoctorRoleLabelKeys, PatientRoleLabelKeys, UserRoleKeys } from '~/enums/roles.enum'
import { Modify } from '~/types/modify.type'

export interface IPatientProfile {
  userId: string
  avatar: string | null
  email: string
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: GenderKeys
  role: UserRoleKeys
  roleLabel: PatientRoleLabelKeys
  height: number
  weight: number
  deletedAt: number
  passwordUpdatedAt: number
}

export interface IUpdatePatientProfile {
  firstName: string
  lastName: string
  phone: string
  dob: string
  gender: GenderKeys
  height: number
  weight: number
}

export interface IUpdatePatientProfileForm
  extends Modify<
    IUpdatePatientProfile,
    {
      height: number | string
      weight: number | string
    }
  > {}

export type UpdatePatientProfileKeys = keyof IUpdatePatientProfile

export interface ICaregiverProfile {
  userId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  avatar: string | null
  role: UserRoleKeys
  roleLabel: CaregiverRoleLabelKeys
  deletedAt: number | null
  passwordUpdatedAt: number
  institution: string
}

export interface IDoctorProfile
  extends Modify<
    ICaregiverProfile,
    {
      roleLabel: DoctorRoleLabelKeys
    }
  > {
  specialty: string
}

export interface IPatientDoctors extends IDoctorProfile {
  accessId: string
}

export interface IPatientCaregivers extends ICaregiverProfile {
  accessId: string
}

export interface IDoctorPatients extends IPatientProfile {
  accessId: string
  lastConnected: number | null
  status: PatientStatus
}

export interface IUpdateDoctorProfile extends Omit<IDoctorProfile, 'email' | 'avatar'> {}

export interface IUpdateCaregiverProfile extends Omit<ICaregiverProfile, 'email' | 'avatar'> {}

export type UpdateDoctorProfileKeys = keyof IUpdateDoctorProfile

export type UpdateCaregiverProfileKeys = keyof IUpdateCaregiverProfile
