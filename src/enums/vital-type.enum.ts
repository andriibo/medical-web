export enum VitalType {
  hr = 'Heart Rate',
  spo2 = 'Oxygen Saturation',
  rr = 'Respiration Rate',
  temp = 'Temperature',
  fall = 'FALL',
  bp = 'Blood Pressure',
}

export enum VitalUnits {
  hr = 'bpm',
  spo2 = '%',
  rr = 'rpm',
  temp = '°C',
  fall = '',
  bp = '',
}

export enum VitalsChartTab {
  hr = 'HR',
  temp = 'TEMP',
  spo2 = 'SPO2',
  rr = 'RR',
}

export type VitalTypeKeys = keyof typeof VitalType
export type VitalsChartTabKeys = keyof typeof VitalsChartTab
