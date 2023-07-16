import { VitalsItem } from '@abnk/medical-support/src/history-vitals/domain/vitals-item'
import { mean, std } from 'mathjs'

import { filterNullable } from '~helpers/filter-nullable'
import { IVitalChart } from '~models/vital.model'

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

export const getVitalsByPeriod = (vitals: VitalsItem[], start: number, end: number): [IVitalChart, number] => {
  let startOffset = 0
  const duration = end - start
  const isLongDuration = duration > INTERVALS_NUMBER * MIN_INTERVAL_DURATION

  let interval = duration / INTERVALS_NUMBER

  if (!isLongDuration) {
    startOffset = 10
    interval = MIN_INTERVAL_DURATION
  }

  const startWithOffset = start - startOffset

  const temporaryArray: VitalsItem[][] = []
  const result: IVitalChart = {
    hr: [],
    spo2: [],
    temp: [],
    rr: [],
  }

  for (
    let currentInterval = startWithOffset, firstIteration = true;
    currentInterval < end;
    currentInterval += interval
  ) {
    let startPoint = currentInterval
    const endPoint = currentInterval + interval

    if (firstIteration && !startOffset) {
      startPoint -= 1
      firstIteration = false
    }

    const filteredByInterval = vitals.filter(
      ({ endTimestamp }) => startPoint < endTimestamp && endTimestamp <= endPoint,
    )

    if (filteredByInterval.length) {
      temporaryArray.push(filteredByInterval)
    } else {
      temporaryArray.push([
        {
          id: '',
          startTimestamp: startPoint,
          endTimestamp: (endPoint + startPoint) / 2,
          thresholdsId: '',
          vitals: {
            temp: {
              value: null,
              isNormal: false,
            },
            hr: {
              value: null,
              isNormal: false,
            },
            spo2: {
              value: null,
              isNormal: false,
            },
            rr: {
              value: null,
              isNormal: false,
            },
          },
          fall: false,
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
        hrArr.push(vital.vitals.hr.value)
        rrArr.push(vital.vitals.rr.value)
        tempArr.push(vital.vitals.temp.value)
        spo2Arr.push(vital.vitals.spo2.value)
        timestampArr.push(vital.endTimestamp)
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
