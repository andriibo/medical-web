import { Clear } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import React, { ChangeEvent, FC } from 'react'

import styles from './search-field.module.scss'

interface SearchFieldProps {
  placeholder?: string
  value: string
  onSearch: (value: string) => void
}

export const SearchField: FC<SearchFieldProps> = ({ placeholder = 'Search', value, onSearch }) => {
  const handleClearSearchField = () => {
    onSearch('')
  }

  const onChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onSearch(event.currentTarget.value)
  }

  return (
    <TextField
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleClearSearchField} size="small" sx={{ visibility: !value ? 'hidden' : '' }}>
            <Clear fontSize="small" />
          </IconButton>
        ),
      }}
      className={styles.searchField}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      variant="standard"
    />
  )
}
