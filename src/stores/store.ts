import { combineReducers, configureStore, Middleware, Reducer } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { authApi } from '~stores/services/auth.api'
import { diagnosesApi } from '~stores/services/diagnoses.api'
import { emergencyContactApi } from '~stores/services/emergency-contact.api'
import { medicationsApi } from '~stores/services/medications.api'
import { patientCategoryApi } from '~stores/services/patient-category.api'
import { patientDataAccessApi } from '~stores/services/patient-data-access.api'
import { patientDiagnosisApi } from '~stores/services/patient-diagnosis.api'
import { patientMedicationApi } from '~stores/services/patient-medication.api'
import { patientVitalThresholdApi } from '~stores/services/patient-vital-threshold.api'
import { profileApi } from '~stores/services/profile.api'
import { suggestedContactApi } from '~stores/services/suggested-contact.api'
import { vitalsApi } from '~stores/services/vitals.api'
import { authReducer } from '~stores/slices/auth.slice'
import { dataAccessReducer } from '~stores/slices/data-access.slice'
import { editEmailReducer } from '~stores/slices/edit-email.slice'
import { emergencyContactReducer } from '~stores/slices/emergency-contact.slice'
import { vitalHistoryReducer } from '~stores/slices/vital-history.slice'

const persistConfig = {
  key: 'root',
  storage,
}

export const combineApi = [
  authApi,
  profileApi,
  diagnosesApi,
  patientCategoryApi,
  patientDiagnosisApi,
  patientMedicationApi,
  patientDataAccessApi,
  medicationsApi,
  patientVitalThresholdApi,
  emergencyContactApi,
  suggestedContactApi,
  vitalsApi,
]

const apiReducers: { [key: string]: Reducer } = {}

combineApi.map((api) => (apiReducers[api.reducerPath] = api.reducer))

const reducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  editEmail: editEmailReducer,
  dataAccess: dataAccessReducer,
  emergencyContact: emergencyContactReducer,
  vitalHistory: vitalHistoryReducer,
  ...apiReducers,
})

const middlewares: Middleware[] = combineApi.map((api) => api.middleware)

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
