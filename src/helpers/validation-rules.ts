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
      value: 100,
      message: 'Max heart rate is 100 bpm',
    },
  },
  respirationRate: {
    required: true,
    min: {
      value: 12,
      message: 'Min respiration rate is 12 rpm',
    },
    max: {
      value: 25,
      message: 'Max respiration rate is 25 rpm',
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
      value: 35,
      message: 'Min temperature is 35 °C',
    },
    max: {
      value: 42,
      message: 'Max temperature is 42 °C',
    },
  },
  saturation: {
    required: true,
    min: {
      value: 80,
      message: 'Min oxygen saturation is 80 %',
    },
    max: {
      value: 100,
      message: 'Max oxygen saturation is 100 %',
    },
  },
  dbp: {
    required: true,
    min: {
      value: 60,
      message: 'Min SBP is 60 mmHg',
    },
    max: {
      value: 80,
      message: 'Max SBP is 80 mmHg',
    },
  },
  sbp: {
    required: true,
    min: {
      value: 100,
      message: 'Min DBP is 100 mmHg',
    },
    max: {
      value: 130,
      message: 'Max DBP is 130 mmHg',
    },
  },
}
