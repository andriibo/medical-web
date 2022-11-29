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
}
