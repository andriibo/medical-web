import { UserRoleKeys } from '~/enums/roles.enum'

export interface IUserModel {
  userId: string
  email: string
  firstName: string
  lastName: string
  avatar: string | null
  role: UserRoleKeys
  phone: string
  deletedAt: number | null
}
