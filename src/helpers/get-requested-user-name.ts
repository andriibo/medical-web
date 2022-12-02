import { IDataAccessUser } from '~models/data-access.model'

interface IUser {
  email: string
  firstName?: string
  lastName?: string
}

export const getRequestedUserName = (user: IUser) => {
  if (user.firstName || user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  return user.email
}
