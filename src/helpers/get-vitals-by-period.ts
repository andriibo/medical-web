import { mean, std } from 'mathjs'

import { filterNullable } from '~helpers/filter-nullable'
import { IVital, IVitalChart } from '~models/vital.model'

const INTERVALS_NUMBER = 60
const MIN_INTERVAL_DURATION = 30

const getIndications = <T extends number | null>(arr: T[], digits: number = 0) => {
  const nonNullableArr = filterNullable(arr)

  if (!nonNullableArr.length) {
    return {
      value: null,
      maxStd: null,
      minStd: null,
    }
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
  const duration = end - start
  const interval =
    duration > INTERVALS_NUMBER * MIN_INTERVAL_DURATION ? duration / INTERVALS_NUMBER : MIN_INTERVAL_DURATION

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
    } else {
      temporaryArray.push([
        {
          temp: null,
          isTempNormal: false,
          hr: null,
          isHrNormal: false,
          spo2: null,
          isSpo2Normal: false,
          rr: null,
          isRrNormal: false,
          fall: null,
          timestamp: (endPoint + startPoint) / 2,
          thresholdsId: '',
        },
      ])
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

      result.hr.push({ ...hrIndications, timestamp: averageTime })
      result.rr.push({ ...rrIndications, timestamp: averageTime })
      result.temp.push({ ...tempIndications, timestamp: averageTime })
      result.spo2.push({ ...spo2Indications, timestamp: averageTime })
    })
  }

  return [result, interval]
}
