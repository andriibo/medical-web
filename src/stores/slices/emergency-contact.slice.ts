import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  IEmergencyContactOrganizationFullModel,
  IEmergencyContactPersonFullModel,
} from '~models/emergency-contact.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IEmergencyContactData {
  data: {
    persons: IEmergencyContactPersonFullModel
    organizations: IEmergencyContactOrganizationFullModel
  }
  emergencyContactIsLoading: boolean
  emergencyContactHasChanges: boolean
}

const initialState: IEmergencyContactData = {
  data: {
    persons: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relationship: 'MedicalProfessional',
      contactId: '',
      createdAt: 0,
    },
    organizations: {
      contactId: '',
      name: '',
      email: '',
      phone: '',
      fax: '',
      type: 'Other',
      createdAt: 0,
    },
  },
  emergencyContactIsLoading: false,
  emergencyContactHasChanges: false,
}

const emergencyContactSlice = createSlice({
  name: 'emergencyContactSlice',
  initialState,
  reducers: {
    setEmergencyContact: (state, { payload }: PayloadAction<IEmergencyContactPersonFullModel>) => {
      state.data.persons = payload
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

export const getEmergencyContact = (state: RootState) => state.emergencyContact.data.persons
export const getEmergencyContactHasChanges = (state: RootState) => state.emergencyContact.emergencyContactHasChanges
export const getEmergencyContactIsLoading = (state: RootState) => state.emergencyContact.emergencyContactIsLoading

export const useEmergencyContact = () => useAppSelector(getEmergencyContact)
export const useEmergencyContactHasChanges = () => useAppSelector(getEmergencyContactHasChanges)
export const useEmergencyContactIsLoading = () => useAppSelector(getEmergencyContactIsLoading)

export const {
  reducer: emergencyContactReducer,
  actions: { setEmergencyContact, clearEmergencyContact, setEmergencyContactIsLoading, setEmergencyContactHasChanges },
} = emergencyContactSlice
