import { UserRole, UserRoleKeys } from '~/enums/roles.enum'
import { useUserRole } from '~stores/slices/auth.slice'

export const useUserRoles = () => {
  const userRole = useUserRole()
  const grantableRoles: UserRoleKeys[] = ['Caregiver', 'Doctor']

  const isUserRoleGrantable = grantableRoles.includes(userRole)

  const isUserRoleCaregiver = UserRole.Caregiver === userRole

  const isUserRolePatient = UserRole.Patient === userRole

  const isUserRoleDoctor = UserRole.Doctor === userRole

  return { isUserRoleGrantable, isUserRoleCaregiver, isUserRolePatient, isUserRoleDoctor }
}
