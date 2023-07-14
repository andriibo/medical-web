import { OrganizationTypeKeys } from '~/enums/organization-type.enum'
import { RelationshipKeys } from '~/enums/relationship.enum'
import { Modify } from '~/types/modify.type'

export interface IEmergencyContactPersonModel {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: RelationshipKeys
}

export interface IEmergencyContactOrganizationModel {
  name: string
  email: string | null
  phone: string
  fax: string | null
  type: OrganizationTypeKeys
}

export interface IEmergencyContactPersonFormModel
  extends Modify<
    IEmergencyContactPersonModel,
    {
      relationship: RelationshipKeys | ''
    }
  > {}

export interface IEmergencyContactPersonFullModel extends IEmergencyContactPersonModel {
  contactId: string
  createdAt: number
}

export interface IEmergencyContactOrganizationFullModel extends IEmergencyContactOrganizationModel {
  contactId: string
  createdAt: number
}

export interface IEmergencyContact {
  persons: IEmergencyContactPersonFullModel[]
  organizations: IEmergencyContactOrganizationFullModel[]
}

export type IEmergencyContactPersonModelKeys = keyof IEmergencyContactPersonModel
