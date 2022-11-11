import { Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '../Header/header'

export const Layout = () => (
  <div>
    <Header />
    <Container>
      <Outlet />
    </Container>
  </div>
)
