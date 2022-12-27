import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IEmergencyContact } from '~models/emergency-contact.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IEmergencyContactData {
  data: IEmergencyContact
  emergencyContactHasChanges: boolean
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
  emergencyContactHasChanges: false,
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
    setEmergencyContactHasChanges: (state, { payload }: PayloadAction<boolean>) => {
      state.emergencyContactHasChanges = payload
    },
  },
})

export const getEmergencyContact = (state: RootState) => state.emergencyContact.data
export const getEmergencyContactHasChanges = (state: RootState) => state.emergencyContact.emergencyContactHasChanges

export const useEmergencyContact = () => useAppSelector(getEmergencyContact)
export const useEmergencyContactHasChanges = () => useAppSelector(getEmergencyContactHasChanges)

export const {
  reducer: emergencyContactReducer,
  actions: { setEmergencyContact, clearEmergencyContact, setEmergencyContactHasChanges },
} = emergencyContactSlice
