import dayjs from 'dayjs'
import React, { FC, useCallback, useMemo } from 'react'
import { VictoryArea } from 'victory-area'
import { VictoryAxis } from 'victory-axis'
import { VictoryChart } from 'victory-chart'
import { VictoryContainer, VictoryTheme } from 'victory-core'
import { VictoryLine } from 'victory-line'
import { VictoryScatter } from 'victory-scatter'
import { VictoryTooltip } from 'victory-tooltip'

import { VitalsChartTabKeys } from '~/enums/vital-type.enum'
import { VITAL_SETTINGS, VITAL_THRESHOLDS_TYPE } from '~constants/constants'
import { filterNullable } from '~helpers/filter-nullable'
import { IThresholds } from '~models/threshold.model'
import { IVitalChartModel, IVitalChartSettings } from '~models/vital.model'

const FlyoutComponent = ({ x, y, datum, style, units }: any) => (
  <g>
    <foreignObject height="50" width="110" x={x - 55} y={y - 58}>
      <div style={style}>
        <strong style={{ fontSize: '1.15em', display: 'block', paddingBottom: '6px' }}>
          {datum.value} {units && units}
        </strong>
        {dayjs(datum._x * 1000).format('MM-DD hh:mm a')}
      </div>
    </foreignObject>
  </g>
)

const colors = {
  primary: '#42a5f5',
  success: '#52b202',
  danger: '#ff1744',
  secondary: '#dfdfdf',
}

const interpolation = 'monotoneX'

interface VitalChartProps {
  activeVitalsType: VitalsChartTabKeys
  vitals: IVitalChartModel[]
  thresholds: IThresholds[]
  startDate: number
  endDate: number
  settings: IVitalChartSettings
}

export const VitalChart: FC<VitalChartProps> = ({
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

  const getTimeFormat = useMemo(() => {
    if (endDate - startDate <= 86400) {
      return 'hh:mm a'
    }

    if (endDate - startDate < 345000) {
      return 'MM/DD hh:mm a'
    }

    return 'MM/DD'
  }, [endDate, startDate])

  const isAbnormal = useCallback(
    (time: number, value: number) => {
      const filteredThresholds = thresholds.filter((item) => item.createdAt <= time)

      if (filteredThresholds.length > 0) {
        const lastThreshold = filteredThresholds[filteredThresholds.length - 1]

        return (maxThreshold && value > lastThreshold[maxThreshold]) || value < lastThreshold[minThreshold]
      }

      return false
    },
    [maxThreshold, minThreshold, thresholds],
  )

  const minMaxValue = useMemo(() => {
    const vitalsValues = filterNullable(vitals.map((item) => item.value))

    const offsetPercent = 10

    let max = Math.max(...vitalsValues)
    let min = Math.min(...vitalsValues)
    const difference = max - min

    if (difference === 0) {
      min -= 1
      max += 1
    }

    if (difference < 1) {
      min -= (difference / 100) * offsetPercent
      max += (difference / 100) * offsetPercent
    }

    return { min, max }
  }, [vitals])

  const minMaxDomain = useMemo((): [number, number] => {
    let { min, max } = minMaxValue

    const thresholdsMinValues = thresholds.map((threshold) => threshold[minThreshold])
    const thresholdsMaxValues = maxThreshold ? thresholds.map((threshold) => threshold[maxThreshold]) : 0
    const stdMinValues = filterNullable(vitals.map((item) => item.minStd))
    const stdMaxValues = filterNullable(vitals.map((item) => item.maxStd))

    if (settings.abnormalValues) {
      min = Math.min(min, ...thresholdsMinValues)

      if (thresholdsMaxValues) {
        max = Math.max(max, ...thresholdsMaxValues, ...thresholdsMinValues)
      } else {
        max = Math.max(max, ...thresholdsMinValues)
      }
    }

    if (settings.variance) {
      min = Math.min(min, ...stdMinValues)
      max = Math.max(max, ...stdMaxValues)
    }

    return [min, max]
  }, [maxThreshold, minMaxValue, minThreshold, settings.abnormalValues, settings.variance, thresholds, vitals])

  return (
    <>
      <VictoryChart
        containerComponent={<VictoryContainer responsive={false} />}
        domain={{ x: [startDate, endDate], y: minMaxDomain }}
        domainPadding={{ y: [30, 30] }}
        height={500}
        padding={{
          left: 60,
          bottom: 50,
          right: 15,
          top: 10,
        }}
        theme={VictoryTheme.material}
        width={852}
      >
        {settings.variance && (
          <VictoryArea
            data={vitals}
            interpolation={interpolation}
            style={{ data: { stroke: colors.secondary, strokeWidth: '2', fill: 'rgb(209 209 209 / 20%)' } }}
            x="timestamp"
            y="maxStd"
            y0="minStd"
          />
        )}
        {settings.variance && (
          <VictoryLine
            data={vitals}
            interpolation={interpolation}
            style={{
              data: { stroke: colors.secondary },
            }}
            x="timestamp"
            y="minStd"
          />
        )}
        <VictoryAxis
          style={{ tickLabels: { angle: 0, padding: 10, fontSize: 12 } }}
          tickFormat={(t) => dayjs(t * 1000).format(getTimeFormat)}
        />
        <VictoryAxis
          dependentAxis
          style={{ tickLabels: { padding: 5, fontSize: 12 } }}
          tickFormat={(t) => `${t} ${VITAL_SETTINGS[activeVitalsType].units}`}
        />
        {settings.abnormalValues && (
          <VictoryLine
            data={thresholds}
            interpolation="stepAfter"
            style={{ data: { stroke: colors.danger, strokeDasharray: 5, strokeWidth: 1 } }}
            x="createdAt"
            y={minThreshold}
          />
        )}
        {settings.abnormalValues && maxThreshold && (
          <VictoryLine
            data={thresholds}
            interpolation="stepAfter"
            style={{ data: { stroke: colors.danger, strokeDasharray: 5, strokeWidth: 1 } }}
            x="createdAt"
            y={maxThreshold}
          />
        )}
        <VictoryLine
          data={vitals}
          interpolation={interpolation}
          standalone={false}
          style={{
            data: { stroke: colors.primary },
          }}
          x="timestamp"
          y="value"
        />
        <VictoryScatter
          data={vitals}
          labelComponent={
            <VictoryTooltip
              flyoutComponent={<FlyoutComponent units={VITAL_SETTINGS[activeVitalsType].units} />}
              flyoutStyle={{
                backgroundColor: ({ datum }) =>
                  settings.abnormalValues && isAbnormal(datum._x, datum._y) ? colors.danger : colors.success,
                strokeWidth: 0,
                fontSize: '13px',
                lineHeight: '1',
                textAlign: 'center',
                color: '#fff',
                borderRadius: '5px',
                padding: '8px 5px 3px',
                height: '100%',
              }}
            />
          }
          labels={() => ''}
          size={({ datum }) => (settings.abnormalValues && isAbnormal(datum._x, datum._y) ? 6 : 4)}
          standalone={false}
          style={{
            data: {
              fill: ({ datum }) =>
                settings.abnormalValues && isAbnormal(datum._x, datum._y) ? colors.danger : colors.success,
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
