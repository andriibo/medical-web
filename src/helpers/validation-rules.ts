import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import validator from 'validator'

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
  phone: {
    required: true,
    // pattern: {
    //   value: /[1]\-[0-9]{3}\-[0-9]{3}\-[0-9]{4}/,
    //   message: 'Enter a valid phone number',
    // },
    pattern: {
      value: /[0-9]{11}/,
      message: 'Enter a valid phone number',
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
        validator.isStrongPassword(value, { minUppercase: 0 }) ||
        'At least 8 characters, at least one number and one symbol.',
    },
  },
  height: {
    required: true,
    min: {
      value: 50,
      message: 'Min height is 50cm',
    },
    max: {
      value: 250,
      message: 'Max height is 250cm',
    },
  },
  weight: {
    required: true,
    min: {
      value: 10,
      message: 'Min weight is 10cm',
    },
    max: {
      value: 200,
      message: 'Max weight is 200cm',
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
      value: 40,
      message: 'Min heart rate is 40 bpm',
    },
    max: {
      value: 220,
      message: 'Max heart rate is 220 bpm',
    },
  },
  respirationRate: {
    required: true,
    min: {
      value: 4,
      message: 'Min respiration rate is 4 rpm',
    },
    max: {
      value: 60,
      message: 'Max respiration rate is 60 rpm',
    },
  },
  arterialPressure: {
    required: true,
    min: {
      value: 40,
      message: 'Min mean-arterial-pressure rate is 40 bpm',
    },
    max: {
      value: 100,
      message: 'Max mean-arterial-pressure rate is 100 bpm',
    },
  },
  temperature: {
    required: true,
    min: {
      value: 32,
      message: 'Min temperature is 32 °C',
    },
    max: {
      value: 42,
      message: 'Max temperature is 42 °C',
    },
  },
  saturation: {
    required: true,
    min: {
      value: 40,
      message: 'Min oxygen saturation is 40 %',
    },
    max: {
      value: 100,
      message: 'Max oxygen saturation is 100 %',
    },
  },
  dbp: {
    required: true,
    min: {
      value: 30,
      message: 'Min SBP is 30 mmHg',
    },
    max: {
      value: 130,
      message: 'Max SBP is 130 mmHg',
    },
  },
  sbp: {
    required: true,
    min: {
      value: 70,
      message: 'Min DBP is 70 mmHg',
    },
    max: {
      value: 220,
      message: 'Max DBP is 220 mmHg',
    },
  },
}
