export interface IEmergencyContactModel {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: string
}

export interface IEmergencyContact extends IEmergencyContactModel {
  contactId: string
  createdAt: string
}
