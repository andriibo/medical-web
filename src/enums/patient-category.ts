export enum PatientCategory {
  Abnormal = 'Abnormal',
  Borderline = 'Borderline',
  Normal = 'Normal',
}

export type PatientCategoryKeys = keyof typeof PatientCategory
