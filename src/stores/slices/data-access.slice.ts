import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UpdateEmailStep } from '~/enums/update-email-step.enum'
import { useAppSelector } from '~stores/hooks'
import { RootState } from '~stores/store'

interface IDataAccess {
  dataAccessHasChanges: boolean
}

const initialState: IDataAccess = {
  dataAccessHasChanges: false,
}

const dataAccessSlice = createSlice({
  name: 'dataAccessSlice',
  initialState,
  reducers: {
    setDataAccessHasChanges: (state, { payload }: PayloadAction<boolean>) => {
      state.dataAccessHasChanges = payload
    },
  },
})

export const getDataAccessHasChanges = (state: RootState) => state.dataAccess.dataAccessHasChanges

export const useDataAccessHasChanges = () => useAppSelector(getDataAccessHasChanges)

export const {
  reducer: dataAccessReducer,
  actions: { setDataAccessHasChanges },
} = dataAccessSlice
