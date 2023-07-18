import { OrganizationType } from '~/enums/organization-type.enum'
import { RelationshipKeys } from '~/enums/relationship.enum'
import { Modify } from '~/types/modify.type'

export interface IPersonCommonContactModel {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: RelationshipKeys
}

export interface IOrganizationCommonContactModel {
  name: string
  email: string | null
  phone: string
  fax: string | null
  type: OrganizationType
}

export interface IPersonEmergencyContactFormModel
  extends Modify<
    IPersonCommonContactModel,
    {
      relationship: RelationshipKeys | ''
    }
  > {}

export interface IOrganizationEmergencyContactFormModel
  extends Modify<
    IOrganizationCommonContactModel,
    {
      type: OrganizationType | ''
    }
  > {}

export interface IPersonEmergencyContactFullModel extends IPersonCommonContactModel {
  contactId: string
  createdAt: number
}

export interface IOrganizationEmergencyContactFullModel extends IOrganizationCommonContactModel {
  contactId: string
  createdAt: number
}

export interface IPersonEmergencyContactFullSliceModel
  extends Modify<
    IPersonEmergencyContactFullModel,
    {
      relationship: RelationshipKeys | ''
    }
  > {}

export interface IOrganizationEmergencyContactFullSliceModel
  extends Modify<
    IOrganizationEmergencyContactFullModel,
    {
      type: OrganizationType | ''
    }
  > {}

export interface IEmergencyContacts {
  persons: IPersonEmergencyContactFullModel[]
  organizations: IOrganizationEmergencyContactFullModel[]
}

export type IPersonEmergencyContactModelKeys = keyof IPersonCommonContactModel
export type IOrganizationEmergencyContactModelKeys = keyof IOrganizationCommonContactModel
