import { IDiagnosis } from '~models/diagnoses.model'
import { IMedication } from '~models/medications.model'
import { IUserModel } from '~models/user.model'

export const setTreatmentAuthor = <T extends IDiagnosis | IMedication>(treatments: T[], users: IUserModel[]): T[] =>
  treatments.map((treatment) => ({
    ...treatment,
    createdByUser: users.find((user) => user.userId === treatment.createdBy),
  }))
