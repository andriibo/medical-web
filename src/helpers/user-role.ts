import { UserRoles } from '~/enums/user-roles.enum'

export const isUserRoleGrantable = (role: UserRoles) => {
  const grantableRoles = [UserRoles.caregiver, UserRoles.doctor]

  return grantableRoles.includes(role)
}

export const isUserRoleCaregiver = (role: string) => UserRoles.caregiver === role

export const isUserRolePatient = (role: string) => UserRoles.patient === role

export const isUserRoleDoctor = (role: string) => UserRoles.doctor === role
