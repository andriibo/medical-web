import { FormControlLabel, FormGroup, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material'
import dayjs from 'dayjs'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { VictoryArea } from 'victory-area'
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
import { IVitalChart, IVitalChartModel, IVitalChartSettings } from '~models/vital.model'

interface VitalChartProps {
  activePeriod: VitalPeriodKeys
  activeVitalsType: VitalsChartTabKeys
  vitals: IVitalChartModel[]
  thresholds: IThresholds[]
  startDate: number
  endDate: number
  settings: IVitalChartSettings
}

export const VitalChart: FC<VitalChartProps> = ({
  activePeriod,
  activeVitalsType,
  vitals,
  thresholds,
  startDate,
  endDate,
  settings,
}) => {
  const { min: minThreshold, max: maxThreshold } = useMemo(
    () => VITAL_THRESHOLDS_TYPE[activeVitalsType],
    [activeVitalsType],
  )

  const isLongPeriod = useMemo(() => endDate - startDate > 594700, [endDate, startDate])

  const isAbnormal = useCallback(
    (time: number, value: number) => {
      const filteredThresholds = thresholds.filter((item) => item.createdAt < time)

      if (filteredThresholds.length > 0) {
        const lastThreshold = filteredThresholds[filteredThresholds.length - 1]

        return (maxThreshold && value >= lastThreshold[maxThreshold]) || value <= lastThreshold[minThreshold]
      }

      return false
    },
    [maxThreshold, minThreshold, thresholds],
  )

  return (
    <>
      <VictoryChart
        containerComponent={<VictoryContainer responsive={false} />}
        domain={{ x: [startDate, endDate] }}
        domainPadding={{ y: [30, 30] }}
        height={500}
        theme={VictoryTheme.material}
        width={850}
      >
        {settings.variance && (
          <VictoryArea
            data={vitals}
            interpolation="catmullRom"
            style={{ data: { stroke: '#dfdfdf', strokeWidth: '2', fill: 'rgb(209 209 209 / 20%)' } }}
            x="timestamp"
            y="maxStd"
            y0="minStd"
          />
        )}
        {settings.variance && (
          <VictoryLine
            data={vitals}
            interpolation="catmullRom"
            style={{
              data: { stroke: '#dfdfdf' },
            }}
            x="timestamp"
            y="minStd"
          />
        )}
        <VictoryAxis
          style={{ tickLabels: { angle: 0, padding: 15, fontSize: 12 } }}
          tickCount={10}
          tickFormat={(t) => dayjs(t * 1000).format(isLongPeriod ? 'MM-DD' : 'hh:mm a')}
        />
        <VictoryAxis dependentAxis />
        {settings.normalZone && (
          <VictoryLine
            data={thresholds}
            // domain={{ x: [startDate, endDate] }}
            interpolation="stepAfter"
            style={{ data: { stroke: '#ff1744', strokeDasharray: 5, strokeWidth: 1 } }}
            x="createdAt"
            y={minThreshold}
          />
        )}
        {settings.normalZone && maxThreshold && (
          <VictoryLine
            data={thresholds}
            // domain={{ x: [startDate, endDate] }}
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
          data={vitals}
          standalone={false}
          style={{
            data: { stroke: '#42a5f5' },
          }}
          x="timestamp"
          y="value"
        />
        <VictoryScatter
          data={vitals}
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{
                fill: ({ datum }) =>
                  settings.abnormalValues && isAbnormal(datum._x, datum._y) ? '#ff1744' : '#42a5f5',
                strokeWidth: 0,
              }}
              style={{ fontSize: '13px', lineHeight: '1', backgroundColor: '42a5f5', fill: '#fff' }}
            />
          }
          labels={({ datum }) => `${datum._y} - ${dayjs(datum._x * 1000).format('MM-DD hh:mm a')}`}
          size={({ datum }) => (settings.abnormalValues && isAbnormal(datum._x, datum._y) ? 6 : 4)}
          standalone={false}
          style={{
            data: {
              fill: ({ datum }) => (settings.abnormalValues && isAbnormal(datum._x, datum._y) ? '#ff1744' : '#1976D2'),
              stroke: '#fff',
              strokeWidth: ({ datum }) => (settings.abnormalValues && isAbnormal(datum._x, datum._y) ? '3px' : '2px'),
            },
          }}
          x="timestamp"
          y="value"
        />
      </VictoryChart>
    </>
  )
}
