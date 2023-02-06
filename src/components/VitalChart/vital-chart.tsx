import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import dayjs from 'dayjs'
import React, { FC, useEffect, useState } from 'react'
import { VictoryArea } from 'victory-area'
import { VictoryAxis } from 'victory-axis'
import { VictoryChart } from 'victory-chart'
import { VictoryContainer, VictoryLabel, VictoryTheme } from 'victory-core'
import { VictoryLine } from 'victory-line'
import { VictoryScatter } from 'victory-scatter'
import { VictoryStack } from 'victory-stack'
import { VictoryTooltip } from 'victory-tooltip'

import { VitalsChartTab, VitalsChartTabKeys } from '~/enums/vital-type.enum'
import { getObjectKeys } from '~helpers/get-object-keys'
import { IThresholds } from '~models/threshold.model'
import { IVitalChart } from '~models/vital.model'

interface VitalChartProps {
  data: IVitalChart[]
  thresholds: IThresholds[]
  start: number
  end: number
}

const minMaxValueY = (data: IVitalChart[], selectedTab: VitalsChartTabKeys): [number, number] => {
  // const offset = selectedTab === 'temp' ? 10 : 10
  const offset = 10

  const max = Math.max(...data.map((item) => item[selectedTab]))
  const min = Math.min(...data.map((item) => item[selectedTab]))
  const diff = max - min
  const maxY = max + (diff / 100) * offset
  const minY = min - (diff / 100) * offset

  const max2 = Math.max(...data.map((item) => item[selectedTab])) + offset
  const min2 = Math.min(...data.map((item) => item[selectedTab])) - offset

  console.log({ max, maxY, min, minY })

  // const max = Math.max(...data.map((item) => item[selectedTab])) + ((100 + offset) * 100%)
  // const min = Math.min(...data.map((item) => item[selectedTab])) - offset

  return [minY, maxY]
  // return [min2, max2]
}

const CustomFlyout = () => {
  console.log(1)

  return (
    <g>
      <circle fill="#f00" r="20" stroke="tomato" />
      <circle fill="none" r="25" stroke="orange" />
      <circle fill="none" r="30" stroke="gold" />
    </g>
  )
}

export const VitalChart: FC<VitalChartProps> = ({ data, thresholds, start, end }) => {
  const [activeTab, setActiveTab] = useState<VitalsChartTabKeys>('hr')
  const [filtered, setFiltered] = useState()

  const handleChangeTab = (event: React.SyntheticEvent, value: VitalsChartTabKeys) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={handleChangeTab}
        size="small"
        sx={{ mb: 2 }}
        value={activeTab}
      >
        {getObjectKeys(VitalsChartTab).map((key) => (
          <ToggleButton key={key} value={key}>
            {VitalsChartTab[key]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <VictoryChart
        containerComponent={<VictoryContainer responsive={false} style={{ width: '100%' }} />}
        // domain={{ x: [start, end], y: minMaxValueY(data, activeTab) }}
        domain={{ x: [start, end] }}
        domainPadding={{ y: [30, 30] }}
        height={500}
        theme={VictoryTheme.material}
        width={850}
      >
        {/* <VictoryLine */}
        {/*   data={thresh} */}
        {/*   style={{ */}
        {/*     parent: { border: '1px solid #ccc' }, */}
        {/*     data: { stroke: '#f00', strokeWidth: '2px' }, */}
        {/*   }} */}
        {/*   // x={data.timespam} */}
        {/*   x="time" */}
        {/*   y={() => 170} */}
        {/* /> */}
        <VictoryAxis
          style={{ tickLabels: { angle: 0, padding: 15, fontSize: 12 } }}
          tickFormat={(t) => dayjs(t * 1000).format('MM-DD hh:mm a')}
        />
        <VictoryAxis dependentAxis />
        <VictoryArea
          samples={1}
          style={{ data: { fill: '#44b70021', stroke: '#89db00', strokeWidth: 1 } }}
          y={() => 150}
          y0={() => 100}
        />
        <VictoryLine samples={1} style={{ data: { stroke: '#89db00', strokeWidth: 1 } }} y={() => 100} />
        <VictoryLabel text={VitalsChartTab[activeTab]} x={40} y={25} />
        <VictoryLine
          data={data}
          labelComponent={
            <VictoryLabel
              backgroundStyle={{ fill: '#f00' }}
              renderInPortal
              style={{
                fontSize: '11px',
                textShadow: '1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff',
              }}
            />
          }
          samples={200}
          style={{
            data: { stroke: '#42a5f5' },
            // parent: { border: '1px solid #000' },
          }}
          x="timestamp"
          y={activeTab}
          // labels={({ datum }) => datum._y}
        />
        <VictoryScatter
          data={data}
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{
                fill: ({ datum }) => (datum._y > 151 || datum._y < 99 ? '#f00' : '#42a5f5'),
                strokeWidth: 0,
              }}
              style={{ fontSize: '13px', lineHeight: '1', backgroundColor: '42a5f5', fill: '#fff' }}
            />
          }
          labels={({ datum }) => datum._y}
          size={4}
          style={{
            data: {
              fill: ({ datum }) => (datum._y > 151 || datum._y < 99 ? '#f00' : '#42a5f5'),
              stroke: '#fff',
              strokeWidth: '2px',
            },
          }}
          x="timestamp"
          y={activeTab}
        />
      </VictoryChart>
    </>
  )
}
