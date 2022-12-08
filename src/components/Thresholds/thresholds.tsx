import React, { FC, useEffect, useLayoutEffect, useState } from 'react'

import { EmptyBox } from '~components/EmptyBox/empty-box'
import { Spinner } from '~components/Spinner/spinner'
import { IThresholdModel } from '~models/threshold.model'
import {
  useLazyGetMyVitalThresholdsQuery,
  useLazyGetPatientVirtualThresholdsQuery,
} from '~stores/services/patient-vital-threshold.api'

interface ThresholdsProps {
  patientUserId?: string
}

export const Thresholds: FC<ThresholdsProps> = ({ patientUserId }) => {
  const [thresholds, setThresholds] = useState<IThresholdModel[]>()
  const [isLoading, setIsLoading] = useState(false)

  const [lazyMyThresholds, { data: myThresholds, isFetching: myThresholdsIsFetching }] =
    useLazyGetMyVitalThresholdsQuery()
  const [lazyPatientThresholds, { data: patientThresholds, isFetching: patientThresholdsIsFetching }] =
    useLazyGetPatientVirtualThresholdsQuery()

  useLayoutEffect(() => {
    if (patientUserId) {
      lazyPatientThresholds({ patientUserId })

      return
    }

    lazyMyThresholds()
  }, [lazyMyThresholds, lazyPatientThresholds, patientUserId])

  useEffect(() => {
    if (patientThresholds) {
      setThresholds(patientThresholds)

      return
    }

    if (myThresholds) {
      setThresholds(myThresholds)
    }
  }, [myThresholds, patientThresholds])

  useEffect(() => {
    if (myThresholdsIsFetching || patientThresholdsIsFetching) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [myThresholdsIsFetching, patientThresholdsIsFetching])

  if (isLoading) {
    return <Spinner />
  }

  if (!thresholds) {
    return <EmptyBox />
  }

  return (
    <div>
      {thresholds.map(({ thresholdName, value }) => (
        <>
          {thresholdName}: {value} <br />
        </>
      ))}
    </div>
  )
}
