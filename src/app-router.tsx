import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { AuthWrapper } from '~/wrappers/AuthWrapper'
import { AuthLayout } from '~components/AuthLayout/auth-layout'
import { Layout } from '~components/Layout/layout'
import { AccountTypeSelection } from '~pages/Auth/account-type-selection'
import { EmailVerification } from '~pages/Auth/email-verification'
import { SignIn } from '~pages/Auth/sign-in'
import { SignUpDoctor } from '~pages/Auth/sign-up-doctor'
import { SignUpPatient } from '~pages/Auth/sign-up-patient'
import { Patient } from '~pages/Patient/patient'

export const AppRouter = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route element={<SignIn />} path="/sign-in" />
      <Route element={<AccountTypeSelection />} path="/account-type" />
      <Route element={<SignUpPatient />} path="/sign-up-patient" />
      <Route element={<SignUpDoctor />} path="/sign-up-doctor" />
      <Route element={<EmailVerification />} path="/email-verification" />
    </Route>
    <Route element={<Layout />} path="/">
      <Route element={<AuthWrapper />}>
        <Route element={<Patient />} path="/patient" />
      </Route>
    </Route>
  </Routes>
)
