import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UpdateEmailStep } from '~/enums/update-email-step.enum'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IEditEmail {
  email: string | null
  popupOpen: boolean
  step: UpdateEmailStep
}

const initialState: IEditEmail = {
  email: null,
  popupOpen: false,
  step: UpdateEmailStep.email,
}

const editEmailSlice = createSlice({
  name: 'EditEmailSlice',
  initialState,
  reducers: {
    setNewEmail: (state, { payload }: PayloadAction<string>) => {
      state.email = payload
    },
    setEditEmailStep: (state, { payload }: PayloadAction<UpdateEmailStep>) => {
      state.step = payload
    },
    openEditEmailPopup: (state) => {
      state.popupOpen = true
    },
    closeEditEmailPopup: (state) => {
      state.popupOpen = false
    },
  },
})

export const getNewEmail = (state: RootState) => state.editEmail.email
export const getEditEmailStep = (state: RootState) => state.editEmail.step
export const getEditEmailPopupOpen = (state: RootState) => state.editEmail.popupOpen

export const useNewEmail = () => useAppSelector(getNewEmail)
export const useEditEmailStep = () => useAppSelector(getEditEmailStep)
export const useEditEmailPopupOpen = () => useAppSelector(getEditEmailPopupOpen)

export const {
  reducer: editEmailReducer,
  actions: { setNewEmail, setEditEmailStep, openEditEmailPopup, closeEditEmailPopup },
} = editEmailSlice
