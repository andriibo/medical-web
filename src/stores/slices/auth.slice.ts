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
      roles: [UserRoles.caregiver],
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
const selectUserRole = (state: RootState) => state.auth.data.user.roles[0]
const selectUserId = (state: RootState) => state.auth.data.user.id

export const useIsAuth = () => useAppSelector(selectIsAuth)
export const useUserRole = () => useAppSelector(selectUserRole)
export const useUserId = () => useAppSelector(selectUserId)

export const {
  reducer: authReducer,
  actions: { setToken, signInSuccess, clearPersist },
} = authSlice
