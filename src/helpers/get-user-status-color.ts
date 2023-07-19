import { PatientStatus } from '~/enums/patient-status.enum'

type Statuses = 'success' | 'error' | 'warning'

export const getUserStatusColor = (category: PatientStatus): Statuses => {
  let status: Statuses = 'success'

  if (category === PatientStatus.Abnormal) {
    status = 'error'
  }

  if (category === PatientStatus.Borderline) {
    status = 'warning'
  }

  return status
}
