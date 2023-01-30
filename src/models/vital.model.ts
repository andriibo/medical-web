import { VitalType } from '~/enums/vital-type.enum'

export interface IVitals {
  vitals: IVital[]
}

export interface IVital {
  timestamp: number
  temperature: number
  hr: number
  spo: number
  rr: number
  fall: boolean
}

export interface IVitalsCard {
  timestamp: number
  title: VitalType
  value: string | number | null | undefined | boolean
  thresholds?: {
    min?: number
    max?: number
  }
  icon: string
  units: string
}
