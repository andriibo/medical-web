import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Relationship, RelationshipValues } from '~/enums/relationship.enum'
import { IEmergencyContact } from '~models/emergency-contact.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IEmergencyContactData {
  data: IEmergencyContact
}

const initialState: IEmergencyContactData = {
  data: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: 'Friends&Family',
    contactId: '',
    createdAt: '',
  },
}

const emergencyContactSlice = createSlice({
  name: 'emergencyContactSlice',
  initialState,
  reducers: {
    setEmergencyContact: (state, { payload }: PayloadAction<IEmergencyContact>) => {
      state.data = payload
    },
    clearEmergencyContact: (state) => {
      state.data = initialState.data
    },
  },
})

export const getEmergencyContact = (state: RootState) => state.emergencyContact.data

export const useEmergencyContact = () => useAppSelector(getEmergencyContact)

export const {
  reducer: emergencyContactReducer,
  actions: { setEmergencyContact, clearEmergencyContact },
} = emergencyContactSlice
