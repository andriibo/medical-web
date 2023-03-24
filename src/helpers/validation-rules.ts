import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import validator from 'validator'
import * as yup from 'yup'

require('yup-phone')

declare module 'yup' {
  export interface StringSchema {
    phone(countryCode?: string, strict?: boolean): StringSchema
  }
}

const phoneSchema = yup.string().phone().required()

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
  | 'message'

type ValidationRulesType = Record<ValidationKeyType, RegisterOptions>

export const minMaxValidationRules = {
  height: {
    min: 50,
    max: 250,
  },
  weight: {
    min: 10,
    max: 200,
  },
  heartRate: {
    min: 40,
    max: 220,
  },
  respirationRate: {
    min: 4,
    max: 60,
  },
  arterialPressure: {
    min: 40,
    max: 100,
  },
  temperature: {
    min: 32,
    max: 42,
  },
  saturation: {
    min: 40,
    max: 100,
  },
  dbp: {
    min: 30,
    max: 130,
  },
  sbp: {
    min: 70,
    max: 220,
  },
}

const { height, weight, heartRate, respirationRate, arterialPressure, temperature, saturation, dbp, sbp } =
  minMaxValidationRules

export const validationRules: ValidationRulesType = {
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
  message: {
    validate: {
      maxLength: (value: string) => value.trim().length <= 500 || 'Max length is 500',
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
  height: {
    required: true,
    min: {
      value: height.min,
      message: `Min height is ${height.min}cm`,
    },
    max: {
      value: height.max,
      message: `Max height is ${height.max}cm`,
    },
  },
  weight: {
    required: true,
    min: {
      value: weight.min,
      message: `Min weight is ${weight.min}cm`,
    },
    max: {
      value: weight.max,
      message: `Max weight is ${weight.max}cm`,
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
  heartRate: {
    required: true,
    min: {
      value: heartRate.min,
      message: `Min heart rate is ${heartRate.min} bpm`,
    },
    max: {
      value: heartRate.max,
      message: `Max heart rate is ${heartRate.max} bpm`,
    },
  },
  respirationRate: {
    required: true,
    min: {
      value: respirationRate.min,
      message: `Min respiration rate is ${respirationRate.min} rpm`,
    },
    max: {
      value: respirationRate.max,
      message: `Max respiration rate is ${respirationRate.max} rpm`,
    },
  },
  arterialPressure: {
    required: true,
    min: {
      value: arterialPressure.min,
      message: `Min mean-arterial-pressure rate is ${arterialPressure.min} bpm`,
    },
    max: {
      value: arterialPressure.max,
      message: `Max mean-arterial-pressure rate is ${arterialPressure.max} bpm`,
    },
  },
  temperature: {
    required: true,
    min: {
      value: temperature.min,
      message: `Min temperature is ${temperature.min} °C`,
    },
    max: {
      value: temperature.max,
      message: `Max temperature is ${temperature.max} °C`,
    },
  },
  saturation: {
    required: true,
    min: {
      value: saturation.min,
      message: `Min oxygen saturation is ${saturation.min} %`,
    },
    max: {
      value: saturation.max,
      message: `Max oxygen saturation is ${saturation.max} %`,
    },
    maxLength: 40,
  },
  dbp: {
    required: true,
    min: {
      value: dbp.min,
      message: `Min SBP is ${dbp.min} mmHg`,
    },
    max: {
      value: dbp.max,
      message: `Max SBP is ${dbp.max} mmHg`,
    },
  },
  sbp: {
    required: true,
    min: {
      value: sbp.min,
      message: `Min DBP is ${sbp.min} mmHg`,
    },
    max: {
      value: sbp.max,
      message: `Max DBP is ${sbp.max} mmHg`,
    },
  },
}
