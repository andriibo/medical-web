export enum OrganizationType {
  Pharmacy = 'Pharmacy',
  Nursing = 'Nursing',
  Home = 'Home',
  Other = 'Other',
}

export type OrganizationTypeKeys = keyof typeof OrganizationType
