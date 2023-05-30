import { PatientRoleLabelKeys } from '~/enums/roles.enum'

export interface IDataAccessModel {
  accessId: string
  direction: string
  status: string
  createdAt: string
  lastInviteSentAt: number
  requestedUser: IDataAccessUser
}

export interface IDataAccessUser {
  email: string
  userId?: string
  firstName?: string
  lastName?: string
  avatar?: string
}

export interface IDataAccessEmail {
  email: string
}

export interface IDataAccessInitiateForGrantedUser {
  roleLabel: PatientRoleLabelKeys | ''
  email: string
}

export type DataAccessInitiateForGrantedUserKeys = keyof IDataAccessInitiateForGrantedUser
