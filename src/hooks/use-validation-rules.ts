import 'yup-phone/dist/yup-phone.cjs'

import { skipToken } from '@reduxjs/toolkit/query'
import dayjs from 'dayjs'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import validator from 'validator'
import * as yup from 'yup'

import { DATE_FORMAT } from '~constants/constants'
import { IMedicationItem } from '~models/medications.model'
import { useGetVitalsAbsoluteQuery } from '~stores/services/vitals.api'

declare module 'yup' {
  export interface StringSchema {
    phone(countryCode?: string, strict?: boolean): StringSchema
  }
}

const phoneSchema = yup.string().phone().required()

type ValidationPropsKeyType =
  | 'height'
  | 'weight'
  | 'heartRate'
  | 'respirationRate'
  | 'arterialPressure'
  | 'temperature'
  | 'saturation'
  | 'dbp'
  | 'sbp'
  | 'dose'

type ValidationKeyType =
  | 'text'
  | 'institution'
  | 'phone'
  | 'fax'
  | 'email'
  | 'emailNotRequired'
  | 'password'
  | 'signInPassword'
  | 'height'
  | 'weight'
  | 'dob'
  | 'gender'
  | 'code'
  | 'diagnosisName'
  | 'medicationName'
  | 'heartRate'
  | 'respirationRate'
  | 'arterialPressure'
  | 'temperature'
  | 'saturation'
  | 'sbp'
  | 'dbp'
  | 'relationship'
  | 'type'
  | 'role'
  | 'roleLabel'
  | 'timesPerDay'
  | 'dose'

type ValidationRulesType = Record<ValidationKeyType, RegisterOptions>

export type ValidationPropsItemType = {
  min: number
  max: number
  unit: string
}

type ValidationPropsType = {
  [key in ValidationPropsKeyType]: ValidationPropsItemType
}

interface ValidationRulesProps {
  getAbsoluteVitals?: boolean
}

export interface IValidationRules {
  validationRules: ValidationRulesType
  validationProps: ValidationPropsType
}

export const useValidationRules = (props: ValidationRulesProps | void): IValidationRules => {
  const { data } = useGetVitalsAbsoluteQuery(props?.getAbsoluteVitals ? undefined : skipToken)

  const validationProps = {
    height: {
      min: 50,
      max: 250,
      unit: 'cm',
    },
    weight: {
      min: 10,
      max: 200,
      unit: 'kg',
    },
    arterialPressure: {
      min: 40,
      max: 100,
      unit: 'mmHg',
    },
    heartRate: {
      min: data?.minHr || 40,
      max: data?.maxHr || 220,
      unit: 'bpm',
    },
    respirationRate: {
      min: data?.minRr || 4,
      max: data?.maxRr || 60,
      unit: 'rmp',
    },
    temperature: {
      min: data?.minTemp || 32,
      max: data?.maxTemp || 42,
      unit: '°C',
    },
    saturation: {
      min: data?.minSpo2 || 40,
      max: data?.maxSpo2 || 100,
      unit: '%',
    },
    dbp: {
      min: data?.minDbp || 30,
      max: data?.maxDbp || 130,
      unit: 'mmHg',
    },
    sbp: {
      min: data?.minSbp || 70,
      max: data?.maxSbp || 220,
      unit: 'mmHg',
    },
    dose: {
      min: 0,
      max: 10000,
      unit: 'mg',
    },
  }

  const { height, weight, heartRate, respirationRate, arterialPressure, temperature, saturation, dbp, sbp, dose } =
    validationProps

  const validationRules: ValidationRulesType = {
    text: {
      required: true,
      validate: {
        isEmpty: (value: string) => value.trim().length > 0,
        maxLength: (value: string) => !(value.trim().length > 30) || 'Max length is 30',
      },
    },
    institution: {
      validate: {
        maxLength: (value: string) => !(value.trim().length > 100) || 'Max length is 100',
      },
    },
    phone: {
      required: true,
      validate: {
        isPhone: async (value: string) => {
          const isValid = await phoneSchema.isValid(value)

          return isValid || 'Enter valid phone number.'
        },
      },
    },
    fax: {
      required: false,
      validate: {
        isPhone: async (value: string) => {
          console.log(454)
          const isValid = !value || (await phoneSchema.isValid(value))

          return isValid || 'Enter valid fax number.'
        },
      },
    },
    email: {
      required: true,
      validate: {
        isEmail: (value: string) => validator.isEmail(value.trim()) || 'Entered value does not match email format',
      },
      maxLength: {
        value: 100,
        message: 'Max length is 100',
      },
    },
    emailNotRequired: {
      required: false,
      validate: {
        isEmail: (value: string) =>
          !value || validator.isEmail(value.trim()) || 'Entered value does not match email format',
      },
      maxLength: {
        value: 100,
        message: 'Max length is 100',
      },
    },
    password: {
      required: true,
      validate: {
        required: (value: string) =>
          (validator.isStrongPassword(value) && value.length === value.trim().length) ||
          'At least 8 characters, one number, one special symbol, one uppercase letter, one lowercase letter ' +
            'and no leading or trailing spaces',
      },
    },
    signInPassword: {
      required: true,
    },
    gender: {
      required: true,
    },
    relationship: {
      required: true,
    },
    type: {
      required: true,
    },
    role: {
      required: true,
    },
    roleLabel: {
      required: true,
    },
    timesPerDay: {
      required: true,
    },
    dob: {
      required: true,
      validate: {
        isDate: (value: string) => {
          if (dayjs(value).unix() > dayjs().unix()) {
            return 'Entered a valid date of birthday'
          }

          return validator.isDate(dayjs(value).format(DATE_FORMAT)) || 'Entered value does not match date format'
        },
      },
    },
    code: {
      required: true,
      pattern: {
        value: /[0-9]{6}/,
        message: 'Enter a valid code',
      },
    },
    diagnosisName: {
      required: true,
    },
    medicationName: {
      required: true,
      validate: {
        isEmpty: (value: IMedicationItem) => {
          console.log(value)

          return Boolean(value.genericName)
        },
      },
    },
    dose: {
      required: true,
      min: {
        value: dose.min,
        message: `Min dose is ${dose.min} ${dose.unit}`,
      },
      max: {
        value: dose.max,
        message: `Max dose is ${dose.max} ${dose.unit}`,
      },
    },
    height: {
      required: true,
      min: {
        value: height.min,
        message: `Min height is ${height.min} ${height.unit}`,
      },
      max: {
        value: height.max,
        message: `Max height is ${height.max} ${height.unit}`,
      },
    },
    weight: {
      required: true,
      min: {
        value: weight.min,
        message: `Min weight is ${weight.min} ${weight.unit}`,
      },
      max: {
        value: weight.max,
        message: `Max weight is ${weight.max} ${weight.unit}`,
      },
    },
    heartRate: {
      required: true,
      min: {
        value: heartRate.min,
        message: `Min heart rate is ${heartRate.min} ${heartRate.unit}`,
      },
      max: {
        value: heartRate.max,
        message: `Max heart rate is ${heartRate.max} ${heartRate.unit}`,
      },
    },
    respirationRate: {
      required: true,
      min: {
        value: respirationRate.min,
        message: `Min respiration rate is ${respirationRate.min} ${respirationRate.unit}`,
      },
      max: {
        value: respirationRate.max,
        message: `Max respiration rate is ${respirationRate.max} ${respirationRate.unit}`,
      },
    },
    arterialPressure: {
      required: true,
      min: {
        value: arterialPressure.min,
        message: `Min mean-arterial-pressure rate is ${arterialPressure.min} ${arterialPressure.unit}`,
      },
      max: {
        value: arterialPressure.max,
        message: `Max mean-arterial-pressure rate is ${arterialPressure.max} ${arterialPressure.unit}`,
      },
    },
    temperature: {
      required: true,
      min: {
        value: temperature.min,
        message: `Min temperature is ${temperature.min} ${temperature.unit}`,
      },
      max: {
        value: temperature.max,
        message: `Max temperature is ${temperature.max} ${temperature.unit}`,
      },
    },
    saturation: {
      required: true,
      min: {
        value: saturation.min,
        message: `Min O2 saturation is ${saturation.min} ${saturation.unit}`,
      },
      max: {
        value: saturation.max,
        message: `Max O2 saturation is ${saturation.max} ${saturation.unit}`,
      },
    },
    dbp: {
      required: true,
      min: {
        value: dbp.min,
        message: `Min DBP is ${dbp.min} ${dbp.unit}`,
      },
      max: {
        value: dbp.max,
        message: `Max DBP is ${dbp.max} ${dbp.unit}`,
      },
    },
    sbp: {
      required: true,
      min: {
        value: sbp.min,
        message: `Min SBP is ${sbp.min} ${sbp.unit}`,
      },
      max: {
        value: sbp.max,
        message: `Max SBP is ${sbp.max} ${sbp.unit}`,
      },
    },
  }

  return { validationRules, validationProps }
}
