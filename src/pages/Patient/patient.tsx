import { Typography } from '@mui/material'
import React, { useEffect } from 'react'

import { useGetDoctorProfileQuery, useGetPatientProfileQuery } from '~stores/services/profile.api'

export const Patient = () => {
  const { data, isLoading, isError } = useGetDoctorProfileQuery({})

  useEffect(() => {
    console.log(111)
  }, [])

  if (!data) {
    return <div>ssssfsdf</div>
  }

  return (
    <>
      <Typography variant="h1">Hello</Typography>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi architecto, doloribus ea earum ex id
      inventore ipsa necessitatibus nisi pariatur porro provident, quis, recusandae reprehenderit repudiandae sit
      temporibus voluptatum?
    </>
  )
}
