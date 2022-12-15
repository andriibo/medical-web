import { UserRoles } from '~/enums/user-roles.enum'

export const isUserRoleGrantable = (role: string): boolean => {
  const grantableRoles = [UserRoles.caregiver, UserRoles.doctor]

  return grantableRoles.includes(role as UserRoles)
}

export const isUserRolePatient = (role: string): boolean => UserRoles.patient == role

export const isUserRoleDoctor = (role: string): boolean => UserRoles.doctor == role
