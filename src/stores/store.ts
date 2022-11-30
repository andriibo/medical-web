import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { authApi } from '~stores/services/auth.api'
import { diagnosesApi } from '~stores/services/diagnoses.api'
import { medicationsApi } from '~stores/services/medications.api'
import { patientDataAccessApi } from '~stores/services/patient-data-access.api'
import { patientDiagnosisApi } from '~stores/services/patient-diagnosis.api'
import { patientMedicationApi } from '~stores/services/patient-medication.api'
import { profileApi } from '~stores/services/profile.api'
import { authReducer } from '~stores/slices/auth.slice'
import { dataAccessReducer } from '~stores/slices/data-access.slice'
import { editEmailReducer } from '~stores/slices/edit-email.slice'

const persistConfig = {
  key: 'root',
  storage,
}

const reducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  editEmail: editEmailReducer,
  dataAccess: dataAccessReducer,

  [authApi.reducerPath]: authApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [diagnosesApi.reducerPath]: diagnosesApi.reducer,
  [patientDiagnosisApi.reducerPath]: patientDiagnosisApi.reducer,
  [patientMedicationApi.reducerPath]: patientMedicationApi.reducer,
  [patientDataAccessApi.reducerPath]: patientDataAccessApi.reducer,
  [medicationsApi.reducerPath]: medicationsApi.reducer,
})

const middlewares = [
  authApi.middleware,
  profileApi.middleware,
  diagnosesApi.middleware,
  patientDiagnosisApi.middleware,
  patientMedicationApi.middleware,
  patientDataAccessApi.middleware,
  medicationsApi.middleware,
]

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
