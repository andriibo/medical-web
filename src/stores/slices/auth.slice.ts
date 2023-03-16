import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import { UserRoles } from '~/enums/user-roles.enum'
import { IAuthData } from '~models/auth.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

export interface AuthState {
  data: IAuthData
}

const initialState: AuthState = {
  data: {
    accessToken: '',
    accessTokenExpireTime: '',
    refreshToken: '',
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
}

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<IAuthData>) => {
      state.data.accessToken = payload.accessToken
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

const selectIsAuth = (state: RootState) => Boolean(state.auth.data.accessToken)
const selectUserRole = (state: RootState) => state.auth.data.user.role
const selectUserId = (state: RootState) => state.auth.data.user.userId
const selectUserEmail = (state: RootState) => state.auth.data.user.email
const selectToken = (state: RootState) => state.auth.data.accessToken
const selectUserDeletedAt = (state: RootState) => state.auth.data.user.deletedAt
const selectUser = (state: RootState) => state.auth.data.user

export const useIsAuth = () => useAppSelector(selectIsAuth)
export const useUserRole = () => useAppSelector(selectUserRole)
export const useUserId = () => useAppSelector(selectUserId)
export const useUserEmail = () => useAppSelector(selectUserEmail)
export const useToken = () => useAppSelector(selectToken)
export const useUserDeletedAt = () => useAppSelector(selectUserDeletedAt)
export const useUser = () => useAppSelector(selectUser)

export const {
  reducer: authReducer,
  actions: { setToken, signInSuccess, clearPersist },
} = authSlice
