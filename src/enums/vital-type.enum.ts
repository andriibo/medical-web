export enum VitalType {
  hr = 'Heart Rate',
  spo2 = 'O2 Saturation',
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
  bp = 'mmHg',
  fall = '',
}

export enum VitalsChartTab {
  hr = 'HR',
  temp = 'TEMP',
  spo2 = 'SPO2',
  rr = 'RR',
}

export enum VitalsFilterTypes {
  all = 'ALL',
  hr = 'HR',
  temp = 'TEMP',
  spo2 = 'SPO2',
  rr = 'RR',
  bp = 'BP',
}

export type VitalTypeKeys = keyof typeof VitalType
export type VitalsChartTabKeys = keyof typeof VitalsChartTab
export type VitalsTypeFilterKeys = keyof typeof VitalsFilterTypes
