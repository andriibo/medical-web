import { Box, Typography } from '@mui/material'
import React from 'react'

import { Thresholds } from '~components/Thresholds/thresholds'
import { Vitals } from '~components/Vitals/vitals'

export const PatientVitals = () => (
  <div className="white-box content-md">
    <Box sx={{ mb: 4 }}>
      <Vitals />
    </Box>
    <Typography sx={{ mb: 1 }} variant="h5">
      Thresholds
    </Typography>
    <Thresholds />
  </div>
)
