import { FieldErrors } from 'react-hook-form'

export const getErrorMessage = (errors: FieldErrors, field: string): string | boolean =>
  errors[field] ? String(errors[field]?.message) || 'This field is required ' : false
