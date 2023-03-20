import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import { UserRoles } from '~/enums/user-roles.enum'
import { IAccessToken, IAuthData } from '~models/auth.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

export interface AuthState {
  data: IAuthData
  hasEmergencyContacts: boolean | null
}

const initialState: AuthState = {
  data: {
    accessToken: '',
    accessTokenExpireTime: 0,
    refreshToken: '',
    user: {
      userId: '',
      email: '',
      role: UserRoles.caregiver,
      firstName: '',
      lastName: '',
      phone: '',
      avatar: '',
      deletedAt: null,
    },
  },
  hasEmergencyContacts: null,
}

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setAccessToken: (state, { payload }: PayloadAction<IAccessToken>) => {
      state.data.accessToken = payload.accessToken
      state.data.accessTokenExpireTime = payload.accessTokenExpireTime
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
      state.hasEmergencyContacts = null

      return state
    },
  },
})

const selectIsAuth = (state: RootState) => Boolean(state.auth.data.accessToken)
const selectUserRole = (state: RootState) => state.auth.data.user.role
const selectUserId = (state: RootState) => state.auth.data.user.userId
const selectUserEmail = (state: RootState) => state.auth.data.user.email
const selectAccessToken = (state: RootState) => state.auth.data.accessToken
const selectUserDeletedAt = (state: RootState) => state.auth.data.user.deletedAt
const selectHasEmergencyContacts = (state: RootState) => state.auth.hasEmergencyContacts

export const useIsAuth = () => useAppSelector(selectIsAuth)
export const useUserRole = () => useAppSelector(selectUserRole)
export const useUserId = () => useAppSelector(selectUserId)
export const useUserEmail = () => useAppSelector(selectUserEmail)
export const useAccessToken = () => useAppSelector(selectAccessToken)
export const useUserDeletedAt = () => useAppSelector(selectUserDeletedAt)
export const useHasEmergencyContacts = () => useAppSelector(selectHasEmergencyContacts)

export const {
  reducer: authReducer,
  actions: { setAccessToken, setHasEmergencyContacts, signInSuccess, clearPersist },
} = authSlice
