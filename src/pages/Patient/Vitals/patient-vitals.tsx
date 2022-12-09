import { Typography } from '@mui/material'
import React from 'react'

import { Thresholds } from '~components/Thresholds/thresholds'

export const PatientVitals = () => (
  <div className="white-box content-md">
    <Typography variant="h5">Thresholds</Typography>
    <Thresholds />
  </div>
)
