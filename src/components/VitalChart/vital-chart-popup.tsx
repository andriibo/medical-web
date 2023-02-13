import { Event } from '@mui/icons-material'
import {
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { mean, std } from 'mathjs'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { VitalPeriod, VitalPeriodKeys } from '~/enums/vital-period'
import { VitalsChartTab, VitalsChartTabKeys } from '~/enums/vital-type.enum'
import { VitalChart } from '~components/VitalChart/vital-chart'
import { TIME_PERIOD } from '~constants/constants'
import { getObjectKeys } from '~helpers/get-object-keys'
import { IThresholds } from '~models/threshold.model'
import { IVital, IVitalChart, IVitalChartSettings, IVitalsData } from '~models/vital.model'
import { useGetPatientVitalsQueryQuery, useLazyGetPatientVitalsQueryQuery } from '~stores/services/vitals.api'

import styles from './vital-chart.module.scss'

interface IVitalResponse {
  vitals: IVitalChart
  thresholds: IThresholds[]
  startDate: number
  endDate: number
  activePeriod: VitalPeriodKeys
}

interface VitalChartPopupProps {
  patientUserId?: string
}

export const VitalChartPopup: FC<VitalChartPopupProps> = ({ patientUserId }) => {
  const [vitalsData, setVitalsData] = useState<IVitalsData>()
  const [activePeriod, setActivePeriod] = useState<VitalPeriodKeys>('month')
  const [activeVitalsType, setActiveVitalsType] = useState<VitalsChartTabKeys>('hr')

  const [vitalResponse, setVitalResponse] = useState<IVitalResponse>()
  const [chartSettings, setChartSettings] = useState<IVitalChartSettings>({
    abnormalValues: false,
    normalZone: false,
    variance: false,
  })

  const handleChangeVitalType = (event: React.SyntheticEvent, value: VitalsChartTabKeys) => {
    if (value !== null) {
      setActiveVitalsType(value)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChartSettings({
      ...chartSettings,
      [event.target.name]: event.target.checked,
    })
  }

  // const [initialStartDate, setInitialStartDate] = useState(
  //   dayjs().subtract(TIME_PERIOD.month.value, TIME_PERIOD.month.unit).toISOString(),
  // )
  // const [initialEndDate, setInitialEndDate] = useState(dayjs().toISOString())

  const [startDate, endDate] = useMemo(
    () => [
      dayjs().subtract(TIME_PERIOD[activePeriod].value, TIME_PERIOD[activePeriod].unit).toISOString(),
      dayjs().toISOString(),
    ],
    [activePeriod],
  )
  // const {
  //   data: patientVitalsData,
  //   isLoading: patientVitalsDataIsLoading,
  //   isFetching,
  //   refetch,
  // } = useGetPatientVitalsQueryQuery({
  //   startDate,
  //   endDate,
  // })
  const [lazyPatientVitals, { isFetching: lazyPatientVitalsIsFetching }] = useLazyGetPatientVitalsQueryQuery()

  // const { data: patientVitalsDataByDoctor, isLoading: myVitalsIsLoading2 } = useGetPatientVitalsByDoctorQuery(
  //   patientUserId ? { startDate, endDate, patientUserId } : skipToken,
  // )

  // useEffect(() => {
  //   if (patientVitalsData) {
  //     setVitalsData({ ...patientVitalsData })
  //   }
  //
  //   // if (patientVitalsDataByDoctor) {
  //   //   setVitalsData({ ...patientVitalsDataByDoctor })
  //   // }
  // }, [patientVitalsData])

  const getIndications = <T extends number | null>(arr: T[], digits: number = 2) => {
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

  const preparedVitals = useCallback((vitals: IVital[], start: number, end: number): [IVitalChart, number] => {
    const interval = (end - start) / 60
    const temporaryArray: IVital[][] = []
    const result: IVitalChart = {
      hr: [],
      spo2: [],
      temp: [],
      rr: [],
    }

    for (let currentInterval = start; currentInterval < end; currentInterval += interval) {
      const filteredByInterval = vitals.filter(
        (vital) => currentInterval <= vital.timestamp && vital.timestamp <= currentInterval + interval,
      )

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
        const tempIndications = getIndications(tempArr)
        const spo2Indications = getIndications(spo2Arr)
        const averageTime = mean(timestampArr)

        if (averageTime !== null) {
          if (hrIndications) result.hr.push({ ...hrIndications, timestamp: averageTime })

          if (rrIndications) result.rr.push({ ...rrIndications, timestamp: averageTime })

          if (tempIndications) result.temp.push({ ...tempIndications, timestamp: averageTime })

          if (spo2Indications) result.spo2.push({ ...spo2Indications, timestamp: averageTime })
        }
      })
    }

    return [result, interval]
  }, [])

  const prepareThresholds = useCallback((thresholds: IThresholds[], startDate: number, endDate: number) => {
    const copyThresholds = [...thresholds.sort((a, b) => a.createdAt - b.createdAt)]

    if (copyThresholds.length > 0) {
      copyThresholds[0] = {
        ...copyThresholds[0],
        createdAt: startDate,
      }

      const cloneOfLastThreshold = { ...copyThresholds[copyThresholds.length - 1] }

      cloneOfLastThreshold.createdAt = endDate

      copyThresholds.push(cloneOfLastThreshold)
    }

    return copyThresholds
  }, [])

  // useEffect(() => {
  //   if (patientVitalsData) {
  //     console.log(patientVitalsData)
  //     console.log(startDate)
  //     console.log(endDate)
  //   }
  // }, [endDate, patientVitalsData, startDate])

  const [rangeStartDate, setRangeStartDate] = useState<Dayjs | null>()
  const [rangeTempStartDate, setRangeTempStartDate] = useState<Dayjs | null>(null)
  const [rangeEndDate, setRangeEndDate] = useState<Dayjs | null>()
  const [rangeTempEndDate, setRangeTempEndDate] = useState<Dayjs | null>(null)

  const handleSetVital = useCallback(async () => {
    let startDate: Dayjs | null | undefined = null
    let endDate: Dayjs | null | undefined = null

    console.log(444)

    if (activePeriod === 'range') {
      startDate = rangeStartDate
      endDate = rangeEndDate
    } else {
      startDate = dayjs().subtract(TIME_PERIOD[activePeriod].value, TIME_PERIOD[activePeriod].unit)
      endDate = dayjs()

      // setRangeStartDate(startDate)
      // setRangeEndDate(endDate)
    }

    if (!startDate || !endDate) return

    const response = await lazyPatientVitals({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }).unwrap()

    const [vitals, interval] = preparedVitals([...response.vitals], startDate.unix(), endDate.unix())
    const thresholds = prepareThresholds([...response.thresholds], startDate.unix(), endDate.unix())
    const timeOffset = interval / 2.5

    setVitalResponse({
      vitals,
      thresholds,
      startDate: startDate.unix() + timeOffset,
      endDate: endDate.unix() - timeOffset,
      activePeriod,
    })
  }, [activePeriod, lazyPatientVitals, prepareThresholds, preparedVitals, rangeEndDate, rangeStartDate])

  const handleChangePeriod = useCallback((event: React.SyntheticEvent, newPeriod: VitalPeriodKeys) => {
    if (newPeriod !== null) {
      setActivePeriod(newPeriod)
    }
  }, [])

  useEffect(() => {
    handleSetVital()
  }, [handleSetVital])

  useEffect(() => {
    if (rangeStartDate) {
      setRangeTempStartDate(rangeStartDate)
    }
  }, [rangeStartDate])

  useEffect(() => {
    if (rangeEndDate) {
      setRangeTempEndDate(rangeEndDate)
    }
  }, [rangeEndDate])

  // useEffect(() => {
  //   if (activePeriod !== 'range' && (!rangeTempEndDate || !rangeTempStartDate)) {
  //     setRangeTempStartDate(dayjs().subtract(TIME_PERIOD[activePeriod].value, TIME_PERIOD[activePeriod].unit))
  //     setRangeTempEndDate(dayjs())
  //   }
  // }, [activePeriod])

  // const loadClass = useMemo(() => setTimeout(() => lazyPatientVitalsIsFetching, [300]), [lazyPatientVitalsIsFetching])

  return (
    <div className="white-box content-md">
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid xs>
          <Typography variant="h5">Vital sign chart</Typography>
        </Grid>
        <Grid>
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={handleChangeVitalType}
            size="small"
            sx={{ mb: 2 }}
            value={activeVitalsType}
          >
            {getObjectKeys(VitalsChartTab).map((key) => (
              <ToggleButton key={key} value={key}>
                {VitalsChartTab[key]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={handleChangePeriod}
        size="small"
        sx={{ mb: 2 }}
        value={activePeriod}
      >
        {getObjectKeys(VitalPeriod).map((key) => (
          <ToggleButton key={key} value={key}>
            {VitalPeriod[key]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className={lazyPatientVitalsIsFetching ? 'loading has' : 'has'}>
        {vitalResponse && Boolean(vitalResponse.vitals[activeVitalsType].length) ? (
          <VitalChart
            activePeriod={vitalResponse.activePeriod}
            activeVitalsType={activeVitalsType}
            endDate={vitalResponse.endDate}
            settings={chartSettings}
            startDate={vitalResponse.startDate}
            thresholds={vitalResponse.thresholds}
            vitals={vitalResponse.vitals[activeVitalsType]}
          />
        ) : (
          <div className={styles.emptyChart}>
            <Typography variant="h4">No data yet</Typography>
          </div>
        )}
      </div>
      <div className="timer-control-holder">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker
            disabled={activePeriod !== 'range'}
            inputFormat="YYYY-MM-DD hh:mm A"
            maxDateTime={rangeTempEndDate}
            onAccept={(newValue) => {
              setRangeStartDate(newValue)
            }}
            onChange={(newValue) => {
              setRangeTempStartDate(newValue)
              // setActiveUntil(newValue)
              //
              // if (newValue && newValue.subtract(4, 'minute').unix() < dayjs().unix()) {
              //   setDateError(true)
              // } else {
              //   setDateError(false)
              // }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  endAdornment: <Event />,
                }}
                // error={dateError && activeUntilEnable}
                // helperText={translate('timer-control-help-text')}
                variant="standard"
              />
            )}
            value={rangeTempStartDate}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker
            disabled={activePeriod !== 'range'}
            inputFormat="YYYY-MM-DD hh:mm:ss A"
            maxDateTime={dayjs()}
            minDateTime={rangeTempStartDate}
            onAccept={(newValue) => {
              setRangeEndDate(newValue)
            }}
            onChange={(newValue) => {
              setRangeTempEndDate(newValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  endAdornment: <Event />,
                }}
                placeholder="End Date"
                // error={dateError && activeUntilEnable}
                // helperText={translate('timer-control-help-text')}
                variant="standard"
              />
            )}
            value={rangeTempEndDate}
          />
        </LocalizationProvider>
      </div>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={chartSettings.abnormalValues} name="abnormalValues" onChange={handleChange} />}
          label="Abnormal values"
        />
        <FormControlLabel
          control={<Switch checked={chartSettings.normalZone} name="normalZone" onChange={handleChange} />}
          label="Normal zone"
        />
        <FormControlLabel
          control={<Switch checked={chartSettings.variance} name="variance" onChange={handleChange} />}
          label="Variance"
        />
      </FormGroup>
    </div>
  )
}
