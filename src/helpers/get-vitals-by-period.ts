import { mean, std } from 'mathjs'

import { IVital, IVitalChart } from '~models/vital.model'

const getIndications = <T extends number | null>(arr: T[], digits: number = 0) => {
  const nonNullableArr = arr.filter((el) => el !== null) as Array<NonNullable<T>>

  if (!nonNullableArr.length) {
    return null
  }

  const meanValue = Number(mean(...nonNullableArr).toFixed(digits))
  const deviation = Number(std(...nonNullableArr).toFixed(digits))
  const maxStd = Number((meanValue + deviation).toFixed(digits))
  const minStd = Number((meanValue - deviation).toFixed(digits))

  return {
    value: meanValue,
    maxStd,
    minStd,
  }
}

export const getVitalsByPeriod = (vitals: IVital[], start: number, end: number): [IVitalChart, number] => {
  const interval = (end - start) / 60
  const temporaryArray: IVital[][] = []
  const result: IVitalChart = {
    hr: [],
    spo2: [],
    temp: [],
    rr: [],
  }

  for (let currentInterval = start, firstIteration = true; currentInterval < end; currentInterval += interval) {
    let startPoint = currentInterval
    const endPoint = currentInterval + interval

    if (firstIteration) {
      startPoint -= 1
      firstIteration = false
    }

    const filteredByInterval = vitals.filter(({ timestamp }) => startPoint < timestamp && timestamp <= endPoint)

    if (filteredByInterval.length) {
      temporaryArray.push(filteredByInterval)
    }
  }

  if (temporaryArray) {
    temporaryArray.forEach((periodVitals) => {
      const hrArr: (number | null)[] = []
      const rrArr: (number | null)[] = []
      const tempArr: (number | null)[] = []
      const spo2Arr: (number | null)[] = []
      const timestampArr: number[] = []

      periodVitals.forEach((vital) => {
        hrArr.push(vital.hr)
        rrArr.push(vital.rr)
        tempArr.push(vital.temp)
        spo2Arr.push(vital.spo2)
        timestampArr.push(vital.timestamp)
      })

      const hrIndications = getIndications(hrArr)
      const rrIndications = getIndications(rrArr)
      const tempIndications = getIndications(tempArr, 1)
      const spo2Indications = getIndications(spo2Arr)
      const averageTime: number = mean(timestampArr)

      if (averageTime !== null) {
        if (hrIndications) result.hr.push({ ...hrIndications, timestamp: averageTime })

        if (rrIndications) result.rr.push({ ...rrIndications, timestamp: averageTime })

        if (tempIndications) result.temp.push({ ...tempIndications, timestamp: averageTime })

        if (spo2Indications) result.spo2.push({ ...spo2Indications, timestamp: averageTime })
      }
    })
  }

  return [result, interval]
}
