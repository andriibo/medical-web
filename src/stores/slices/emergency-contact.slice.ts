import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  IOrganizationEmergencyContactFullModel,
  IOrganizationEmergencyContactFullSliceModel,
  IPersonEmergencyContactFullModel,
  IPersonEmergencyContactFullSliceModel,
} from '~models/emergency-contact.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IEmergencyContactData {
  data: {
    persons: IPersonEmergencyContactFullSliceModel
    organizations: IOrganizationEmergencyContactFullSliceModel
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
      relationship: '',
      contactId: '',
      createdAt: 0,
    },
    organizations: {
      contactId: '',
      name: '',
      email: '',
      phone: '',
      fax: '',
      type: '',
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
    setPersonEmergencyContact: (state, { payload }: PayloadAction<IPersonEmergencyContactFullModel>) => {
      state.data.organizations = initialState.data.organizations
      state.data.persons = payload
    },
    setOrganizationEmergencyContact: (state, { payload }: PayloadAction<IOrganizationEmergencyContactFullModel>) => {
      state.data.persons = initialState.data.persons
      state.data.organizations = payload
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

export const getPersonEmergencyContact = (state: RootState) => state.emergencyContact.data.persons
export const getOrganizationEmergencyContact = (state: RootState) => state.emergencyContact.data.organizations
export const getEmergencyContactHasChanges = (state: RootState) => state.emergencyContact.emergencyContactHasChanges
export const getEmergencyContactIsLoading = (state: RootState) => state.emergencyContact.emergencyContactIsLoading

export const usePersonEmergencyContact = () => useAppSelector(getPersonEmergencyContact)
export const useOrganizationEmergencyContact = () => useAppSelector(getOrganizationEmergencyContact)
export const useEmergencyContactHasChanges = () => useAppSelector(getEmergencyContactHasChanges)
export const useEmergencyContactIsLoading = () => useAppSelector(getEmergencyContactIsLoading)

export const {
  reducer: emergencyContactReducer,
  actions: {
    setPersonEmergencyContact,
    setOrganizationEmergencyContact,
    clearEmergencyContact,
    setEmergencyContactIsLoading,
    setEmergencyContactHasChanges,
  },
} = emergencyContactSlice
