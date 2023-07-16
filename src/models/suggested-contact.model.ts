import { IOrganizationCommonContactModel, IPersonCommonContactModel } from '~models/emergency-contact.model'

export interface IPersonSuggestedContactRequest extends IPersonCommonContactModel {
  patientUserId: string
}

export interface IOrganizationSuggestedContactRequest extends IOrganizationCommonContactModel {
  patientUserId: string
}

interface ISuggestedByUser {
  userId: string
  email: string
  firstName: string
  lastName: string
  phone: string
  avatar: string | null
  role: string
  roleLabel: string
  deleteAt: number | null
  passwordUpdatedAt: number
}

export interface IPersonSuggestedContact extends IPersonCommonContactModel {
  contactId: string
  suggestedAt: number
  suggestedByUser: ISuggestedByUser
}

export interface IOrganizationSuggestedContact extends IOrganizationCommonContactModel {
  contactId: string
  suggestedAt: number
  suggestedByUser: ISuggestedByUser
}

export interface ISuggestedContacts {
  persons: IPersonSuggestedContact[]
  organizations: IOrganizationSuggestedContact[]
}
