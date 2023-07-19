export enum Relationship {
  MedicalProfessional = 'Medical Professional',
  Caregiver = 'Caregiver',
  'Friends&Family' = 'Friends & Family',
}

export type RelationshipKeys = keyof typeof Relationship
