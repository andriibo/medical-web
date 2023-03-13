import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import { UserRoles } from '~/enums/user-roles.enum'
import { IAuthData } from '~models/auth.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

export interface AuthState {
  data: IAuthData
  hasEmergencyContacts: boolean
}

const initialState: AuthState = {
  data: {
    token: '',
    tokenExpireTime: '',
    user: {
      userId: '',
      email: '',
      role: UserRoles.caregiver,
      firstName: '',
      lastName: '',
      phone: '',
      avatar: '',
      deletedAt: 0,
    },
  },
  hasEmergencyContacts: false,
}

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<IAuthData>) => {
      state.data.token = payload.token
    },
    setHasEmergencyContacts: (state, { payload }: PayloadAction<boolean>) => {
      state.hasEmergencyContacts = payload
    },
    signInSuccess: (state, { payload }: PayloadAction<IAuthData>) => {
      state.data = payload
    },
    clearPersist: (state) => {
      storage.removeItem('persist:root')
      localStorage.clear()
      sessionStorage.clear()

      state.data = initialState.data

      return state
    },
  },
})

const selectIsAuth = (state: RootState) => Boolean(state.auth.data.token)
const selectUserRole = (state: RootState) => state.auth.data.user.role
const selectUserId = (state: RootState) => state.auth.data.user.userId
const selectToken = (state: RootState) => state.auth.data.token
const selectUserDeletedAt = (state: RootState) => state.auth.data.user.deletedAt
const selectHasEmergencyContacts = (state: RootState) => state.auth.hasEmergencyContacts

export const useIsAuth = () => useAppSelector(selectIsAuth)
export const useUserRole = () => useAppSelector(selectUserRole)
export const useUserId = () => useAppSelector(selectUserId)
export const useToken = () => useAppSelector(selectToken)
export const useUserDeletedAt = () => useAppSelector(selectUserDeletedAt)
export const useHasEmergencyContacts = () => useAppSelector(selectHasEmergencyContacts)

export const {
  reducer: authReducer,
  actions: { setToken, setHasEmergencyContacts, signInSuccess, clearPersist },
} = authSlice
