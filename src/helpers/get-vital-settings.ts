import { VitalTypeKeys } from '~/enums/vital-type.enum'
import { VITAL_SETTINGS as VitalSettings } from '~constants/constants'
import { IVitalsSettings } from '~models/vital.model'

export const getVitalSettings = (name: VitalTypeKeys): IVitalsSettings => ({
  title: VitalSettings[name].title,
  icon: VitalSettings[name].icon,
  units: VitalSettings[name].units,
  type: name,
})
