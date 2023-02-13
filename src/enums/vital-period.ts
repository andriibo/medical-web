export enum VitalPeriod {
  oneHour = '1H',
  twelveHours = '12H',
  day = '24H',
  week = '7D',
  month = '30D',
  range = 'Range',
}

export type VitalPeriodKeys = keyof typeof VitalPeriod
