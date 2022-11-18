import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { IsAuthCheckWrapper } from '~/wrappers/is-auth-check-wrapper'
import { IsNotAuthCheckWrapper } from '~/wrappers/is-not-auth-check-wrapper'
import { AuthLayout } from '~components/Layouts/auth-layout'
import { DefaultLayout } from '~components/Layouts/default-layout'
import { AccountTypeSelection } from '~pages/Auth/account-type-selection'
import { EmailVerification } from '~pages/Auth/email-verification'
import { SignIn } from '~pages/Auth/sign-in'
import { SignUpDoctor } from '~pages/Auth/sign-up-doctor'
import { SignUpPatient } from '~pages/Auth/sign-up-patient'
import { MyAccount } from '~pages/MyAccount/my-account'
import { Patient } from '~pages/Patient/patient'

export const AppRouter = () => (
  <Routes>
    <Route element={<IsNotAuthCheckWrapper />}>
      <Route element={<AuthLayout />}>
        <Route element={<SignIn />} path={PageUrls.SignIn} />
        <Route element={<AccountTypeSelection />} path={PageUrls.AccountType} />
        <Route element={<SignUpPatient />} path={PageUrls.SignUpPatient} />
        <Route element={<SignUpDoctor />} path={PageUrls.SignUpDoctor} />
        <Route element={<EmailVerification />} path={PageUrls.EmailVerification} />
      </Route>
    </Route>
    <Route element={<IsAuthCheckWrapper />}>
      <Route element={<DefaultLayout />}>
        <Route element={<Patient />} path="/" />
        <Route element={<MyAccount />} path={PageUrls.MyAccount} />
      </Route>
    </Route>
  </Routes>
)
