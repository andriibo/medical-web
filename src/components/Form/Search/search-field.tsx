import { Clear, Search } from '@mui/icons-material'
import { Button, IconButton, InputAdornment, TextField } from '@mui/material'
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'

interface SearchFieldProps {
  placeholder?: string
  onSearch: (value: string) => void
}

export const SearchField: FC<SearchFieldProps> = ({ placeholder = 'Search', onSearch }) => {
  const [searchValue, setSearchValue] = useState('')

  const handleClearSearchField = () => {
    setSearchValue('')
    onSearch('')
  }

  const onChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchValue)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [onSearch, searchValue])

  return (
    <>
      <IconButton>
        <Search />
      </IconButton>
      <TextField
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleClearSearchField} size="small" sx={{ visibility: !searchValue ? 'hidden' : '' }}>
              <Clear fontSize="small" />
            </IconButton>
          ),
        }}
        onChange={onChange}
        placeholder={placeholder}
        sx={{
          margin: 'auto 0',
          background: 'rgb(0 0 0 / 4%)',
          boxShadow: 'none',
          '.MuiInputBase-root': {
            '&:after, &:before': {
              display: 'none',
            },
          },
          // '.MuiInputBase-root:after, .MuiInputBase-root:before': {
          //   display: 'none',
          // },
          '.MuiInput-input': {
            height: 24,
            padding: '5px 8px',
            border: 0,
          },
        }}
        value={searchValue}
        variant="standard"
      />
    </>
  )
}
