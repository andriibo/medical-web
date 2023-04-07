import { UserRoles } from '~/enums/user-roles.enum'
import { useUserRole } from '~stores/slices/auth.slice'

export const useUserRoles = () => {
  const userRole = useUserRole()
  const grantableRoles = [UserRoles.caregiver, UserRoles.doctor]

  const isUserRoleGrantable = grantableRoles.includes(userRole)

  const isUserRoleCaregiver = UserRoles.caregiver === userRole

  const isUserRolePatient = UserRoles.patient === userRole

  const isUserRoleDoctor = UserRoles.doctor === userRole

  return { isUserRoleGrantable, isUserRoleCaregiver, isUserRolePatient, isUserRoleDoctor }
}
