export enum VitalOrder {
  recent = 'Recent first',
  oldest = 'Oldest first',
}

export type VitalOrderKeys = keyof typeof VitalOrder
