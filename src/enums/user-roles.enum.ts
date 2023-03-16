export enum UserRoles {
  patient = 'Patient',
  doctor = 'Doctor',
  caregiver = 'Caregiver',
}

export type UserRolesValues = keyof typeof UserRoles
