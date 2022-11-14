import { Typography } from '@mui/material'
import React from 'react'

import { useGetDoctorProfileQuery } from '~stores/services/profile.api'

export const Patient = () => {
  const { data, isLoading, isError } = useGetDoctorProfileQuery({})

  return (
    <>
      <Typography variant="h1">Hello</Typography>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi architecto, doloribus ea earum ex id
      inventore ipsa necessitatibus nisi pariatur porro provident, quis, recusandae reprehenderit repudiandae sit
      temporibus voluptatum?
    </>
  )
}
