export interface IDataAccessModel {
  accessId: string
  direction: string
  status: string
  createdAt: string
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
  role: string
  email: string
}

export type DataAccessInitiateForGrantedUserKeys = keyof IDataAccessInitiateForGrantedUser
