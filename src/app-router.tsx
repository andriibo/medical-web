import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { UserRoles } from '~/enums/user-roles.enum'
import { AuthLayout } from '~components/Layouts/auth-layout'
import { DefaultLayout } from '~components/Layouts/default-layout'
import { AccountTypeSelection } from '~pages/Auth/account-type-selection'
import { EmailVerification } from '~pages/Auth/email-verification'
import { ForgotPassword } from '~pages/Auth/forgot-password'
import { ForgotPasswordConfirm } from '~pages/Auth/forgot-password-confirm'
import { ForgotPasswordSuccess } from '~pages/Auth/forgot-password-success'
import { SignIn } from '~pages/Auth/sign-in'
import { SignUpDoctor } from '~pages/Auth/sign-up-doctor'
import { SignUpPatient } from '~pages/Auth/sign-up-patient'
import { DoctorAccount } from '~pages/Doctor/Account/doctor-account'
import { Home } from '~pages/Home/home'
import { PatientAccount } from '~pages/Patient/Account/patient-account'
import { useUserRole } from '~stores/slices/auth.slice'

export const AppRouter = () => {
  const userRole = useUserRole()

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route element={<SignIn />} path={PageUrls.SignIn} />
        <Route element={<ForgotPassword />} path={PageUrls.ForgotPassword} />
        <Route element={<ForgotPasswordConfirm />} path={PageUrls.ForgotPasswordConfirm} />
        <Route element={<ForgotPasswordSuccess />} path={PageUrls.ForgotPasswordSuccess} />
        <Route element={<AccountTypeSelection />} path={PageUrls.AccountType} />
        <Route element={<SignUpPatient />} path={PageUrls.SignUpPatient} />
        <Route element={<SignUpDoctor />} path={PageUrls.SignUpDoctor} />
        <Route element={<EmailVerification />} path={PageUrls.EmailVerification} />
      </Route>
      <Route element={<DefaultLayout />}>
        <Route element={<Home />} path="/" />
        {userRole === UserRoles.doctor ? (
          <Route element={<DoctorAccount />} path={PageUrls.MyAccount} />
        ) : (
          <Route element={<PatientAccount />} path={PageUrls.MyAccount} />
        )}
      </Route>
    </Routes>
  )
}
