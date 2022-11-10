import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit'

import { authApi } from '~stores/services/auth.api'

const reducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
})

const middlewares = [authApi.middleware]

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
