import { Close, Event } from '@mui/icons-material'
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
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
import React, { FC, useCallback, useEffect, useState } from 'react'

import { VitalPeriod, VitalPeriodKeys } from '~/enums/vital-period'
import { VitalsChartTab, VitalsChartTabKeys } from '~/enums/vital-type.enum'
import { VitalChart } from '~components/VitalChart/vital-chart'
import { TIME_PERIOD, VITAL_SETTINGS as VitalSettings } from '~constants/constants'
import { getObjectKeys } from '~helpers/get-object-keys'
import { getVitalsByPeriod } from '~helpers/get-vitals-by-period'
import { IThresholds } from '~models/threshold.model'
import { IVitalChart, IVitalChartSettings, IVitalsData } from '~models/vital.model'
import { useLazyGetPatientVitalsByDoctorQuery, useLazyGetPatientVitalsQuery } from '~stores/services/vitals.api'

import styles from './vital-chart.module.scss'

interface IVitalResponse {
  vitals: IVitalChart
  thresholds: IThresholds[]
  startDate: number
  endDate: number
}

interface VitalChartPopupProps {
  patientUserId?: string
  vitalsType: VitalsChartTabKeys | null
  initialStartDate: Dayjs | null
  initialEndDate: Dayjs | null
  open: boolean
  handleClose: () => void
}

export const VitalChartPopup: FC<VitalChartPopupProps> = ({
  vitalsType = 'hr',
  initialStartDate,
  initialEndDate,
  open,
  handleClose,
  patientUserId,
}) => {
  const [activePeriod, setActivePeriod] = useState<VitalPeriodKeys>('range')
  const [activeVitalsType, setActiveVitalsType] = useState<VitalsChartTabKeys>(vitalsType || 'hr')

  const [vitalResponse, setVitalResponse] = useState<IVitalResponse>()
  const [chartSettings, setChartSettings] = useState<IVitalChartSettings>({
    abnormalValues: false,
    variance: false,
  })

  const [rangeStartDate, setRangeStartDate] = useState<Dayjs | null>(initialStartDate)
  const [rangeTempStartDate, setRangeTempStartDate] = useState<Dayjs | null>(initialStartDate)
  const [rangeEndDate, setRangeEndDate] = useState<Dayjs | null>(initialEndDate)
  const [rangeTempEndDate, setRangeTempEndDate] = useState<Dayjs | null>(initialEndDate)

  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const [lazyPatientVitals, { isFetching: lazyPatientVitalsIsFetching }] = useLazyGetPatientVitalsQuery()
  const [lazyPatientVitalsByDoctor, { isFetching: lazyPatientVitalsByDoctorIsFetching }] =
    useLazyGetPatientVitalsByDoctorQuery()

  useEffect(() => {
    if (lazyPatientVitalsIsFetching || lazyPatientVitalsByDoctorIsFetching) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [lazyPatientVitalsByDoctorIsFetching, lazyPatientVitalsIsFetching])

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

  const handleSetVital = useCallback(async () => {
    let startDate: Dayjs | null | undefined = null
    let endDate: Dayjs | null | undefined = null

    if (activePeriod === 'range') {
      startDate = rangeStartDate
      endDate = rangeEndDate
    } else {
      startDate = dayjs().subtract(TIME_PERIOD[activePeriod].value, TIME_PERIOD[activePeriod].unit)
      endDate = dayjs()
    }

    if (!startDate || !endDate) return

    let response: IVitalsData | null = null

    if (!patientUserId) {
      response = await lazyPatientVitals({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }).unwrap()
    } else {
      response = await lazyPatientVitalsByDoctor({
        patientUserId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }).unwrap()
    }

    const [vitals] = getVitalsByPeriod([...response.vitals], startDate.unix(), endDate.unix())
    const thresholds = prepareThresholds([...response.thresholds], startDate.unix(), endDate.unix())

    setVitalResponse({
      vitals,
      thresholds,
      startDate: startDate.unix(),
      endDate: endDate.unix(),
    })
  }, [
    activePeriod,
    lazyPatientVitals,
    lazyPatientVitalsByDoctor,
    patientUserId,
    prepareThresholds,
    rangeEndDate,
    rangeStartDate,
  ])

  const handleChangePeriod = useCallback((event: React.SyntheticEvent, newPeriod: VitalPeriodKeys) => {
    if (newPeriod !== null) {
      setActivePeriod(newPeriod)
    }
  }, [])

  useEffect(() => {
    handleSetVital()
  }, [handleSetVital])

  useEffect(() => {
    if (vitalsType) {
      setActiveVitalsType(vitalsType)
    }
  }, [vitalsType, open])

  useEffect(() => {
    setActivePeriod('range')
  }, [open])

  useEffect(() => {
    setRangeStartDate(initialStartDate)
  }, [initialStartDate])

  useEffect(() => {
    setRangeEndDate(initialEndDate)
  }, [initialEndDate])

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

  return (
    <Dialog fullWidth maxWidth="md" onClose={handleClose} open={open} scroll="body">
      <DialogTitle variant="h5">
        Vital sign chart
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid xs>
            <ToggleButtonGroup
              color="primary"
              exclusive
              onChange={handleChangeVitalType}
              size="small"
              value={activeVitalsType}
            >
              {getObjectKeys(VitalsChartTab).map((key) => (
                <ToggleButton key={key} value={key}>
                  {VitalsChartTab[key]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          <Grid>
            <ToggleButtonGroup
              color="primary"
              exclusive
              onChange={handleChangePeriod}
              size="small"
              value={activePeriod}
            >
              {getObjectKeys(VitalPeriod).map((key) => (
                <ToggleButton key={key} value={key}>
                  {VitalPeriod[key]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid xs>
            <Typography variant="h6">{VitalSettings[activeVitalsType].title}</Typography>
          </Grid>
          <Grid>
            {activePeriod === 'range' && (
              <div className={styles.rangeHolder}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    disabled={activePeriod !== 'range'}
                    inputFormat="MM/DD hh:mm A"
                    maxDateTime={dayjs().subtract(1, 'hour')}
                    minDateTime={dayjs().subtract(1, 'month')}
                    onAccept={(newValue) => {
                      setRangeStartDate(newValue)
                      if (newValue && rangeTempEndDate && newValue > rangeTempEndDate) {
                        setRangeTempEndDate(dayjs(newValue).add(2, 'hours'))
                        setEndDateOpen(true)
                      }
                    }}
                    onChange={(newValue) => {
                      setRangeTempStartDate(newValue)
                    }}
                    onClose={() => setStartDateOpen(false)}
                    onOpen={() => setStartDateOpen(true)}
                    open={startDateOpen}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{
                          shrink: false,
                        }}
                        InputProps={{
                          endAdornment: <Event />,
                        }}
                        placeholder="From Date"
                        variant="standard"
                      />
                    )}
                    toolbarTitle="Select Start Date"
                    value={rangeTempStartDate}
                  />
                </LocalizationProvider>
                <span className={styles.rangeHolderSeparator}>-</span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    disabled={!rangeStartDate}
                    inputFormat="MM/DD hh:mm A"
                    maxDate={dayjs()}
                    minDateTime={dayjs(rangeStartDate).add(1, 'hour')}
                    onAccept={(newValue) => {
                      setRangeEndDate(newValue)
                    }}
                    onChange={(newValue) => {
                      setRangeTempEndDate(newValue)
                    }}
                    onClose={() => setEndDateOpen(false)}
                    onOpen={() => setEndDateOpen(true)}
                    open={endDateOpen}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          endAdornment: <Event />,
                        }}
                        placeholder="End Date"
                        variant="standard"
                      />
                    )}
                    toolbarTitle="Select End Date"
                    value={rangeTempEndDate}
                  />
                </LocalizationProvider>
              </div>
            )}
          </Grid>
        </Grid>
        <div className={`${styles.chartHolder} ${isLoading ? 'loading' : ''}`}>
          {isLoading && <CircularProgress className="loading-icon" />}
          {vitalResponse && Boolean(vitalResponse.vitals[activeVitalsType].length) ? (
            <VitalChart
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
        <FormGroup row sx={{ justifyContent: 'center' }}>
          <FormControlLabel
            control={<Switch checked={chartSettings.abnormalValues} name="abnormalValues" onChange={handleChange} />}
            label="Abnormal values"
          />
          <FormControlLabel
            control={<Switch checked={chartSettings.variance} name="variance" onChange={handleChange} />}
            label="Variance"
          />
        </FormGroup>
      </DialogContent>
    </Dialog>
  )
}
