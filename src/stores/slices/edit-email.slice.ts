import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IEditEmail {
  email: string | null
}

const initialState: IEditEmail = {
  email: null,
}

const editEmailSlice = createSlice({
  name: 'EditEmailSlice',
  initialState,
  reducers: {
    setNewEmail: (state, { payload }: PayloadAction<string>) => {
      state.email = payload
    },
    clearNewEmail: (state) => {
      state.email = null
    },
  },
})

export const getNewEmail = (state: RootState) => state.editEmail.email

export const useNewEmail = () => useAppSelector(getNewEmail)

export const {
  reducer: editEmailReducer,
  actions: { setNewEmail, clearNewEmail },
} = editEmailSlice
