import { CheckCircleOutline, HighlightOffOutlined } from '@mui/icons-material'
import React, { FC, useMemo } from 'react'

import styles from './password-rules.module.scss'

interface PasswordRulesProps {
  value: string
  error: boolean
}

export const PasswordRules: FC<PasswordRulesProps> = ({ value, error }) => {
  const rules = useMemo(
    () => [
      { title: 'At least 8 characters long', isValid: value.length >= 8 },
      { title: 'Contains uppercase letters', isValid: value.match(/[A-Z]/) },
      { title: 'Contains lowercase letters', isValid: value.match(/[a-z]/) },
      { title: 'Contains numbers', isValid: value.match(/[0-9]/) },
      { title: 'Contains special characters', isValid: value.match(/[ ~`!@#$%^&*()\-_+={}[\]|/\\:;"'<>,.?]/) },
    ],
    [value],
  )

  return (
    <ul className={styles.rulesList}>
      {rules.map((rule) => (
        <li
          className={`${styles.rulesItem}  ${error ? styles.error : ''} ${rule.isValid ? styles.success : ''}`}
          key={rule.title}
        >
          {rule.isValid ? <CheckCircleOutline /> : <HighlightOffOutlined />}
          <span>{rule.title}</span>
        </li>
      ))}
    </ul>
  )
}
