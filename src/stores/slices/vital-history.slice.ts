import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IVitalsData } from '~models/vital.model'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IVital {
  data: IVitalsData
  requestTime: string | null
  patientId: string | null
}

const initialState: IVital = {
  data: {
    vitals: [],
    thresholds: [],
    users: [],
  },
  requestTime: null,
  patientId: null,
}

const vitalHistorySlice = createSlice({
  name: 'VitalHistorySlice',
  initialState,
  reducers: {
    setVitalHistory: (state, { payload }: PayloadAction<IVitalsData>) => {
      state.data.vitals = [...state.data.vitals, ...payload.vitals]
      state.data.thresholds = [...state.data.thresholds, ...payload.thresholds]
      state.data.users = [...state.data.users, ...payload.users]
    },
    setVitalHistoryRequestTime: (state, { payload }: PayloadAction<string>) => {
      state.requestTime = payload
    },
    setVitalHistoryPatientId: (state, { payload }: PayloadAction<string | null>) => {
      state.patientId = payload
    },
    clearVitalHistory: (state) => {
      state.data = initialState.data
      state.requestTime = initialState.requestTime
    },
  },
  extraReducers: {
    'Auth/clearPersist': (state) => {
      state.data = initialState.data
      state.requestTime = initialState.requestTime
      state.patientId = initialState.patientId
    },
  },
})

export const getVitalHistory = (state: RootState) => state.vitalHistory.data
export const getVitalHistoryRequestTime = (state: RootState) => state.vitalHistory.requestTime
export const getVitalHistoryPatientId = (state: RootState) => state.vitalHistory.patientId

export const useVitalHistory = () => useAppSelector(getVitalHistory)
export const useVitalHistoryRequestTime = () => useAppSelector(getVitalHistoryRequestTime)
export const useVitalHistoryPatientId = () => useAppSelector(getVitalHistoryPatientId)

export const {
  reducer: vitalHistoryReducer,
  actions: { setVitalHistory, setVitalHistoryRequestTime, setVitalHistoryPatientId, clearVitalHistory },
} = vitalHistorySlice
