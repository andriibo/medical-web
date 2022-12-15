import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { AuthLayout } from '~components/Layouts/auth-layout'
import { DefaultLayout } from '~components/Layouts/default-layout'
import { isUserRoleCaregiver, isUserRoleDoctor, isUserRoleGrantable } from '~helpers/user-role'
import { AccountTypeSelection } from '~pages/Auth/account-type-selection'
import { EmailVerification } from '~pages/Auth/email-verification'
import { ForgotPassword } from '~pages/Auth/forgot-password'
import { ForgotPasswordConfirm } from '~pages/Auth/forgot-password-confirm'
import { ForgotPasswordSuccess } from '~pages/Auth/forgot-password-success'
import { SignIn } from '~pages/Auth/sign-in'
import { SignUpDoctor } from '~pages/Auth/sign-up-doctor'
import { SignUpPatient } from '~pages/Auth/sign-up-patient'
import { CaregiverAccount } from '~pages/Caregiver/Account/caregiver-account'
import { DoctorAccount } from '~pages/Doctor/Account/doctor-account'
import { DoctorPatient } from '~pages/Doctor/Patient/doctor-patient'
import { DoctorPatients } from '~pages/Doctor/Patients/doctor-patients'
import { DoctorRequest } from '~pages/Doctor/Requests/doctor-request'
import { Home } from '~pages/Home/home'
import { PatientAccount } from '~pages/Patient/Account/patient-account'
import { PatientMd } from '~pages/Patient/MedicalDoctors/patient-md'
import { PatientRequests } from '~pages/Patient/Requests/patient-requests'
import { PatientVitals } from '~pages/Patient/Vitals/patient-vitals'
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
        {isUserRoleDoctor(userRole) ?? <Route element={<DoctorAccount />} path={PageUrls.MyAccount} />}
        {isUserRoleCaregiver(userRole) ?? <Route element={<CaregiverAccount />} path={PageUrls.MyAccount} />}
        {isUserRoleGrantable(userRole) ? (
          <>
            <Route element={<DoctorAccount />} path={PageUrls.MyAccount} />
            <Route element={<DoctorPatients />} path={PageUrls.Patients} />
            <Route element={<DoctorRequest />} path={PageUrls.Requests} />
            <Route element={<DoctorPatient />} path={`${PageUrls.Patient}/:patientUserId`} />
          </>
        ) : (
          <>
            <Route element={<PatientAccount />} path={PageUrls.MyAccount} />
            <Route element={<PatientMd />} path={PageUrls.MedicalDoctors} />
            <Route element={<PatientRequests />} path={PageUrls.Requests} />
            <Route element={<PatientVitals />} path={PageUrls.Vitals} />
          </>
        )}
      </Route>
    </Routes>
  )
}
