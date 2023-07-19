export enum OrganizationType {
  Pharmacy = 'Pharmacy',
  NursingHome = 'Nursing Home',
  Other = 'Other',
}

export type OrganizationTypeKeys = keyof typeof OrganizationType
