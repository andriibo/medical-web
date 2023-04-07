import { Clear } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import React, { ChangeEvent, FC } from 'react'

interface SearchFieldProps {
  placeholder?: string
  searchValue: string
  onSearch: (value: string) => void
}

export const SearchField: FC<SearchFieldProps> = ({ placeholder = 'Search', searchValue, onSearch }) => {
  const handleClearSearchField = () => {
    // setSearchValue('')
    onSearch('')
  }

  const onChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onSearch(event.currentTarget.value)
  }

  return (
    <>
      {/* <IconButton> */}
      {/*   <Search /> */}
      {/* </IconButton> */}
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
          margin: 'auto 0 auto auto',
          background: 'rgb(0 0 0 / 3%)',
          boxShadow: 'none',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgb(0 0 0 / 5%)',
          },
          '&:has(:focus)': {
            background: 'rgb(0 0 0 / 8%)',
          },
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
