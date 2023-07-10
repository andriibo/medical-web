import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import { IAuthData } from '~models/auth.model'
import { IUserModel } from '~models/user.model'
import { db } from '~stores/helpers/db'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

export interface AuthState {
  data: IAuthData
  hasEmergencyContacts: boolean | null
}

const initialState: AuthState = {
  data: {
    accessToken: '',
    accessTokenExpireTime: '',
    refreshToken: '',
    user: {
      userId: '',
      email: '',
      role: 'Caregiver',
      roleLabel: '',
      firstName: '',
      lastName: '',
      phone: '',
      avatar: null,
      deletedAt: 0,
    },
  },
  hasEmergencyContacts: null,
}

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<IAuthData>) => {
      state.data.accessToken = payload.accessToken
    },
    setUserData: (state, { payload }: PayloadAction<IAuthData>) => {
      state.data = payload
    },
    setUser: (state, { payload }: PayloadAction<IUserModel>) => {
      state.data.user = payload
    },
    setUserAvatar: (state, { payload }: PayloadAction<string | null>) => {
      state.data.user.avatar = payload
    },
    setUserName: (state, { payload }: PayloadAction<{ firstName: string; lastName: string }>) => {
      state.data.user.firstName = payload.firstName
      state.data.user.lastName = payload.lastName
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

      db.transaction('rw', db.tables, async () => {
        await Promise.all(db.tables.map((table) => table.clear()))
      })

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
const selectUser = (state: RootState) => state.auth.data.user
const selectHasEmergencyContacts = (state: RootState) => state.auth.hasEmergencyContacts

export const useIsAuth = () => useAppSelector(selectIsAuth)
export const useUserRole = () => useAppSelector(selectUserRole)
export const useUserId = () => useAppSelector(selectUserId)
export const useUserEmail = () => useAppSelector(selectUserEmail)
export const useToken = () => useAppSelector(selectAccessToken)
export const useUserDeletedAt = () => useAppSelector(selectUserDeletedAt)
export const useUser = () => useAppSelector(selectUser)
export const useHasEmergencyContacts = () => useAppSelector(selectHasEmergencyContacts)

export const {
  reducer: authReducer,
  actions: {
    setToken,
    setUser,
    setUserData,
    setUserAvatar,
    setUserName,
    setHasEmergencyContacts,
    signInSuccess,
    clearPersist,
  },
} = authSlice
