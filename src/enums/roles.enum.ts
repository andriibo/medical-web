export enum UserRole {
  Patient = 'Patient',
  Doctor = 'Doctor',
  Caregiver = 'Caregiver',
}

export enum CaregiverRoleLabel {
  CaregiverProfessional = 'Caregiver Professional',
  Family = 'Family',
  Friend = 'Friend',
}

export enum DoctorRoleLabel {
  Doctor = 'Doctor',
  Nurse = 'Nurse',
}

export const GrantedUserLabel = { ...DoctorRoleLabel, ...CaregiverRoleLabel }

export enum PatientRoleLabel {
  Patient = 'Patient',
}

export type UserRoleKeys = keyof typeof UserRole
export type CaregiverRoleLabelKeys = keyof typeof CaregiverRoleLabel
export type DoctorRoleLabelKeys = keyof typeof DoctorRoleLabel
export type PatientRoleLabelKeys = keyof typeof PatientRoleLabel

export type GrantedUserLabelKeys = keyof typeof GrantedUserLabel
