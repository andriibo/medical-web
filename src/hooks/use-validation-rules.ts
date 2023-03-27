import { skipToken } from '@reduxjs/toolkit/query'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import validator from 'validator'
import * as yup from 'yup'

import { useGetVitalsAbsoluteQuery } from '~stores/services/vitals.api'

require('yup-phone')

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

type ValidationKeyType =
  | 'text'
  | 'institution'
  | 'phone'
  | 'email'
  | 'password'
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
  | 'role'

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
  }

  const { height, weight, heartRate, respirationRate, arterialPressure, temperature, saturation, dbp, sbp } =
    validationProps

  const validationRules: ValidationRulesType = {
    text: {
      required: true,
      maxLength: {
        value: 30,
        message: 'Max length is 30',
      },
    },
    institution: {
      maxLength: {
        value: 100,
        message: 'Max length is 100',
      },
    },
    phone: {
      required: true,
      validate: {
        required: async (value: string) => {
          const isValid = await phoneSchema.isValid(`+${value}`)

          return isValid || 'Enter valid phone number.'
        },
      },
    },
    email: {
      required: true,
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: 'Entered value does not match email format',
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
          validator.isStrongPassword(value) ||
          'At least 8 characters, one number, one special symbol, one uppercase letter and one lowercase letter.',
      },
    },
    gender: {
      required: true,
    },
    relationship: {
      required: true,
    },
    role: {
      required: true,
    },
    dob: {
      required: true,
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
        message: `Min oxygen saturation is ${saturation.min} ${saturation.unit}`,
      },
      max: {
        value: saturation.max,
        message: `Max oxygen saturation is ${saturation.max} ${saturation.unit}`,
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
