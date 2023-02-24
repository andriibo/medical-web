import { RelationshipValues } from '~/enums/relationship.enum'

export interface ISuggestedContactModel {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: RelationshipValues
}

export interface ISuggestedContactRequest extends ISuggestedContactModel {
  patientUserId: string
}

export interface ISuggestedContact extends ISuggestedContactModel {
  contactId: string
  suggestedAt: number
  suggestedByUser: {
    userId: string
    email: string
    firstName: string
    lastName: string
    phone: string
    avatar: string
  }
}

export type ISuggestedContactModelKeys = keyof ISuggestedContactModel
