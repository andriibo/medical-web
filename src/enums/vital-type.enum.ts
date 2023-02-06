export enum VitalType {
  hr = 'Heart Rate',
  spo2 = 'Oxygen Saturation',
  rr = 'Respiration Rate',
  temp = 'Temperature',
  fall = 'FALL',
  bp = 'Blood Pressure',
}

export enum VitalsChartTab {
  hr = 'HR',
  spo2 = 'SPO2',
  rr = 'RR',
  temp = 'TEMP',
}

export type VitalsChartTabKeys = keyof typeof VitalsChartTab
