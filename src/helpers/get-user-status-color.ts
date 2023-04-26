import { PatientCategory } from '~/enums/patient-category.enum'

type Statuses = 'success' | 'error' | 'warning'

export const getUserStatusColor = (category: PatientCategory): Statuses => {
  let status: Statuses = 'success'

  if (category === PatientCategory.Abnormal) {
    status = 'error'
  }

  if (category === PatientCategory.Borderline) {
    status = 'warning'
  }

  return status
}
