import { IDataAccessUser } from '~models/data-access.model'

export const getRequestedUserName = (user: IDataAccessUser) => {
  if (user.firstName || user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  return user.email
}
