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
