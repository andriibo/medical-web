import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { AuthLayout } from '~components/AuthLayout/auth-layout'
import { Layout } from '~components/Layout/layout'
import { AccountTypeSelection } from '~pages/Auth/account-type-selection'
import { SignIn } from '~pages/Auth/sign-in'
import { SignUpDoctor } from '~pages/Auth/sign-up-doctor'
import { SignUpPatient } from '~pages/Auth/sign-up-patient'
import { Patient } from '~pages/Patient/patient'

export const AppRouter = () => (
  <Routes>
    <Route element={<AuthLayout />} path="/">
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<SignUpPatient />} path="/sign-up-patient" />
      <Route element={<SignUpDoctor />} path="/sign-up-doctor" />
      <Route element={<AccountTypeSelection />} path="/account-type" />
    </Route>
    <Route element={<Layout />} path="/">
      <Route element={<Patient />} path="/sss" />
    </Route>
  </Routes>
)
