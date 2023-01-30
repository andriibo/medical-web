import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'

import { IThresholds } from '~models/threshold.model'
import {
  useGetMyVitalThresholdsQuery,
  useGetPatientVirtualThresholdsQuery,
} from '~stores/services/patient-vital-threshold.api'

interface ThresholdsProps {
  patientUserId?: string
}

export const useThresholds = ({ patientUserId }: ThresholdsProps) => {
  const [thresholds, setThresholds] = useState<IThresholds>()
  const [isLoading, setIsLoading] = useState(false)

  const { data: myThresholds, isLoading: myThresholdsIsLoading } = useGetMyVitalThresholdsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientThresholds, isLoading: patientThresholdsIsLoading } = useGetPatientVirtualThresholdsQuery(
    patientUserId ? { patientUserId } : skipToken,
  )

  useEffect(() => {
    if (patientThresholds && !patientThresholdsIsLoading) {
      setThresholds({ ...patientThresholds })

      return
    }

    if (myThresholds && !myThresholdsIsLoading) {
      setThresholds({ ...myThresholds })
    }
  }, [myThresholds, myThresholdsIsLoading, patientThresholds, patientThresholdsIsLoading])

  useEffect(() => {
    if (myThresholdsIsLoading || patientThresholdsIsLoading) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [myThresholdsIsLoading, patientThresholdsIsLoading])

  return {
    thresholds,
    isLoading,
  }
}
