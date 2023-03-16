import { UserRoles } from '~/enums/user-roles.enum'

export interface IUserModel {
  userId: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  role: UserRoles
  phone: string
  deletedAt: number | null
}
