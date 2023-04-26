import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Relationship } from '~/enums/relationship.enum'
import { getObjectKeys } from '~helpers/get-object-keys'
import { IEmergencyContact } from '~models/emergency-contact.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IEmergencyContactData {
  data: IEmergencyContact
  emergencyContactIsLoading: boolean
  emergencyContactHasChanges: boolean
}

const initialState: IEmergencyContactData = {
  data: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: getObjectKeys(Relationship)[0],
    contactId: '',
    createdAt: 0,
  },
  emergencyContactIsLoading: false,
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
    setEmergencyContactIsLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.emergencyContactIsLoading = payload
    },
    setEmergencyContactHasChanges: (state, { payload }: PayloadAction<boolean>) => {
      state.emergencyContactHasChanges = payload
    },
  },
})

export const getEmergencyContact = (state: RootState) => state.emergencyContact.data
export const getEmergencyContactHasChanges = (state: RootState) => state.emergencyContact.emergencyContactHasChanges
export const getEmergencyContactIsLoading = (state: RootState) => state.emergencyContact.emergencyContactIsLoading

export const useEmergencyContact = () => useAppSelector(getEmergencyContact)
export const useEmergencyContactHasChanges = () => useAppSelector(getEmergencyContactHasChanges)
export const useEmergencyContactIsLoading = () => useAppSelector(getEmergencyContactIsLoading)

export const {
  reducer: emergencyContactReducer,
  actions: { setEmergencyContact, clearEmergencyContact, setEmergencyContactIsLoading, setEmergencyContactHasChanges },
} = emergencyContactSlice
