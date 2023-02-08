import { FormControlLabel, FormGroup, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material'
import dayjs from 'dayjs'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { VictoryAxis } from 'victory-axis'
import { VictoryChart } from 'victory-chart'
import { VictoryContainer, VictoryLabel, VictoryTheme } from 'victory-core'
import { VictoryLine } from 'victory-line'
import { VictoryScatter } from 'victory-scatter'
import { VictoryTooltip } from 'victory-tooltip'

import { VitalPeriodKeys } from '~/enums/vital-period'
import { VitalsChartTab, VitalsChartTabKeys } from '~/enums/vital-type.enum'
import { VITAL_THRESHOLDS_TYPE } from '~constants/constants'
import { getObjectKeys } from '~helpers/get-object-keys'
import { IThresholds } from '~models/threshold.model'
import { IVitalChart } from '~models/vital.model'

interface VitalChartProps {
  activePeriod: VitalPeriodKeys
  vitals: IVitalChart
  thresholds: IThresholds[]
  start: number
  end: number
}

export const VitalChart: FC<VitalChartProps> = ({ activePeriod, vitals, thresholds, start, end }) => {
  const [activeVitalsType, setActiveVitalsType] = useState<VitalsChartTabKeys>('hr')

  const [state, setState] = useState({
    abnormalValues: true,
    normalZone: true,
    variance: false,
  })

  const { min: minThreshold, max: maxThreshold } = useMemo(
    () => VITAL_THRESHOLDS_TYPE[activeVitalsType],
    [activeVitalsType],
  )

  const handleChangeTab = (event: React.SyntheticEvent, value: VitalsChartTabKeys) => {
    if (value !== null) {
      setActiveVitalsType(value)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    })
  }

  const isAbnormal = useCallback(
    (time: number, value: number) => {
      const filteredThresholds = thresholds.filter((item) => item.createdAt < time)

      if (filteredThresholds.length > 0) {
        const lastThreshold = filteredThresholds[filteredThresholds.length - 1]

        return (maxThreshold && value > lastThreshold[maxThreshold]) || value < lastThreshold[minThreshold]
      }

      return false
    },
    [maxThreshold, minThreshold, thresholds],
  )

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={handleChangeTab}
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
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={state.abnormalValues} name="abnormalValues" onChange={handleChange} />}
          label="Abnormal values"
        />
        <FormControlLabel
          control={<Switch checked={state.normalZone} name="normalZone" onChange={handleChange} />}
          label="Normal zone"
        />
        <FormControlLabel
          control={<Switch checked={state.variance} name="variance" onChange={handleChange} />}
          disabled
          label="Variance"
        />
      </FormGroup>
      <VictoryChart
        containerComponent={<VictoryContainer responsive={false} />}
        domain={{ x: [start, end] }}
        domainPadding={{ y: [30, 30] }}
        height={500}
        theme={VictoryTheme.material}
        width={850}
      >
        <VictoryAxis
          animate={{ duration: 500 }}
          style={{ tickLabels: { angle: 0, padding: 15, fontSize: 12 } }}
          tickCount={10}
          tickFormat={(t) => {
            if (activePeriod === 'week' || activePeriod === 'month') {
              return dayjs(t * 1000).format('MM-DD')
            }

            return dayjs(t * 1000).format('hh:mm a')
          }}
        />
        <VictoryAxis animate={{ duration: 500 }} dependentAxis />
        {state.normalZone && (
          <VictoryLine
            // animate={{ duration: 500 }}
            data={thresholds}
            domain={{ x: [start, end] }}
            interpolation="stepAfter"
            style={{ data: { stroke: '#ff1744', strokeDasharray: 5, strokeWidth: 1 } }}
            x="createdAt"
            y={minThreshold}
          />
        )}
        {state.normalZone && maxThreshold && (
          <VictoryLine
            // animate={{ duration: 500 }}
            data={thresholds}
            domain={{ x: [start, end] }}
            interpolation="stepAfter"
            style={{ data: { stroke: '#ff1744', strokeDasharray: 5, strokeWidth: 1 } }}
            x="createdAt"
            y={maxThreshold}
          />
        )}
        {/* {maxThreshold && ( */}
        {/*   <VictoryScatter */}
        {/*     animate={{ duration: 500 }} */}
        {/*     data={thresholds} */}
        {/*     labelComponent={ */}
        {/*       <VictoryTooltip */}
        {/*         flyoutStyle={{ */}
        {/*           fill: '#000', */}
        {/*           strokeWidth: 0, */}
        {/*         }} */}
        {/*         style={{ fontSize: '13px', lineHeight: '1', backgroundColor: '#42a5f5', fill: '#fff' }} */}
        {/*       /> */}
        {/*     } */}
        {/*     labels={({ datum }) => `${datum._y} ${dayjs(datum._x * 1000).format('MM-DD hh:mm a')}`} */}
        {/*     size={4} */}
        {/*     style={{ */}
        {/*       data: { */}
        {/*         fill: '#ff1744', */}
        {/*         stroke: '#fff', */}
        {/*         strokeWidth: '2px', */}
        {/*       }, */}
        {/*     }} */}
        {/*     x="createdAt" */}
        {/*     y={maxThreshold} */}
        {/*   /> */}
        {/* )} */}
        <VictoryLabel text={VitalsChartTab[activeVitalsType]} x={40} y={25} />
        <VictoryLine
          data={vitals[activeVitalsType]}
          style={{
            data: { stroke: '#42a5f5' },
          }}
          x="timestamp"
          y="value"
        />
        <VictoryScatter
          data={vitals[activeVitalsType]}
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{
                fill: ({ datum }) => (state.abnormalValues && isAbnormal(datum._x, datum._y) ? '#ff1744' : '#42a5f5'),
                strokeWidth: 0,
              }}
              style={{ fontSize: '13px', lineHeight: '1', backgroundColor: '42a5f5', fill: '#fff' }}
            />
          }
          labels={({ datum }) => `${datum._y} ${dayjs(datum._x * 1000).format('MM-DD hh:mm a')}`}
          size={({ datum }) => (state.abnormalValues && isAbnormal(datum._x, datum._y) ? 6 : 4)}
          style={{
            data: {
              fill: ({ datum }) => (state.abnormalValues && isAbnormal(datum._x, datum._y) ? '#ff1744' : '#42a5f5'),
              stroke: '#fff',
              strokeWidth: ({ datum }) => (state.abnormalValues && isAbnormal(datum._x, datum._y) ? '3px' : '2px'),
            },
          }}
          x="timestamp"
          y="value"
        />
      </VictoryChart>
    </>
  )
}
