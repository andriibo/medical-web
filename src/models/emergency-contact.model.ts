import { RelationshipValues } from '~/enums/relationship.enum'
import { Modify } from '~/types/modify.type'

export interface IEmergencyContactModel {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: RelationshipValues
}

export interface IEmergencyContactFormModel
  extends Modify<
    IEmergencyContactModel,
    {
      relationship: RelationshipValues | ''
    }
  > {}

export interface IEmergencyContact extends IEmergencyContactModel {
  contactId: string
  createdAt: number
}

export type IEmergencyContactModelKeys = keyof IEmergencyContactModel
