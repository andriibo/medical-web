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
    token: '',
    tokenExpireTime: '',
    user: {
      id: '',
      email: '',
      role: UserRoles.caregiver,
      userId: '',
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
      state.data.token = payload.token
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
const selectUserId = (state: RootState) => state.auth.data.user.id
const selectToken = (state: RootState) => state.auth.data.token

export const useIsAuth = () => useAppSelector(selectIsAuth)
export const useUserRole = () => useAppSelector(selectUserRole)
export const useUserId = () => useAppSelector(selectUserId)
export const useToken = () => useAppSelector(selectToken)

export const {
  reducer: authReducer,
  actions: { setToken, signInSuccess, clearPersist },
} = authSlice
