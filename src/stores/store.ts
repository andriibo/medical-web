import { combineReducers, configureStore, Middleware, Reducer } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { BASE_API } from '~constants/constants'
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
import { authReducer, clearPersist } from '~stores/slices/auth.slice'
import { dataAccessReducer } from '~stores/slices/data-access.slice'
import { editEmailReducer } from '~stores/slices/edit-email.slice'
import { emergencyContactReducer } from '~stores/slices/emergency-contact.slice'

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
  ...apiReducers,
})

const middlewares: Middleware[] = combineApi.map((api) => api.middleware)

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)

export const callLogOut = async () => {
  const state = store.getState()
  const { refreshToken, accessToken } = state.auth.data

  try {
    if (refreshToken) {
      const response = await fetch(`${BASE_API}/sign-out`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorMessage = await response.text()

        throw new Error(errorMessage)
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    store.dispatch(clearPersist())
  }
}

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
