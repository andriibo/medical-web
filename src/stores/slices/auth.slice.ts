import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'
import { AuthDataResponse } from '~stores/types/auth.types'

export interface AuthState {
  data: AuthDataResponse
}

const initialState: AuthState = {
  data: {
    token: '',
    tokenExpireTime: '',
    user: {
      id: '',
      email: '',
      roles: [''],
    },
  },
}

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<AuthDataResponse>) => {
      state.data.token = payload.token
    },
    signInSuccess: (state, { payload }: PayloadAction<AuthDataResponse>) => {
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

const selectToken = (state: RootState) => state.auth.data.token
const selectIsAuth = (state: RootState) => Boolean(state.auth.data.token)

export const useToken = () => useAppSelector(selectToken)
export const useIsAuth = () => useAppSelector(selectIsAuth)

export const {
  reducer: authReducer,
  actions: { setToken, signInSuccess, clearPersist },
} = authSlice
