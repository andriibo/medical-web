import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout/layout'
import { Patient } from './pages/Patient/patient'

export const AppRouter = () => (
  <Routes>
    <Route element={<Layout />} path="/">
      <Route element={<Patient />} path="/" />
    </Route>
  </Routes>
)
