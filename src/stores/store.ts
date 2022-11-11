import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { authApi } from '~stores/services/auth.api'
import { profileApi } from '~stores/services/profile.api'
import { authReducer } from '~stores/slices/auth.slice'

const persistConfig = {
  key: 'root',
  storage,
}

const reducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),

  [authApi.reducerPath]: authApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
})

const middlewares = [authApi.middleware, profileApi.middleware]

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
