export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export type GenderKeys = keyof typeof Gender
