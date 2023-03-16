import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'

import { IThresholdsData } from '~models/threshold.model'
import {
  useGetMyVitalThresholdsQuery,
  useGetPatientVirtualThresholdsQuery,
} from '~stores/services/patient-vital-threshold.api'

interface ThresholdsProps {
  patientUserId?: string
}

export const useThresholds = ({ patientUserId }: ThresholdsProps) => {
  const [thresholdsData, setThresholdsData] = useState<IThresholdsData | { threshold: null; users: null }>({
    threshold: null,
    users: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const { data: myThresholds, isLoading: myThresholdsIsLoading } = useGetMyVitalThresholdsQuery(
    patientUserId ? skipToken : undefined,
  )

  const { data: patientThresholds, isLoading: patientThresholdsIsLoading } = useGetPatientVirtualThresholdsQuery(
    patientUserId ? { patientUserId } : skipToken,
  )

  useEffect(() => {
    if (patientThresholds && !patientThresholdsIsLoading) {
      setThresholdsData({ ...patientThresholds })

      return
    }

    if (myThresholds && !myThresholdsIsLoading) {
      setThresholdsData({ ...myThresholds })
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
    threshold: thresholdsData.threshold,
    users: thresholdsData.users,
    isLoading,
  }
}
