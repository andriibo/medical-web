export enum Relationship {
  MedicalProfessional = 'Medical Professional',
  Caregiver = 'Caregiver',
  'Friends&Family' = 'Friends & Family',
}

export type RelationshipValues = keyof typeof Relationship
