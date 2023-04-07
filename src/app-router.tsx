import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { AuthLayout } from '~components/Layouts/auth-layout'
import { DefaultLayout } from '~components/Layouts/default-layout'
import { StaticLayout } from '~components/Layouts/static-layout'
import { isUserRoleGrantable } from '~helpers/user-role'
import { AccountRecovery } from '~pages/AccountRecovery/account-recovery'
import { AddEmergencyContact } from '~pages/AddEmergencyContact/add-emergency-contact'
import { AccountTypeSelection } from '~pages/Auth/account-type-selection'
import { EmailVerification } from '~pages/Auth/email-verification'
import { ForgotPassword } from '~pages/Auth/forgot-password'
import { ForgotPasswordConfirm } from '~pages/Auth/forgot-password-confirm'
import { ForgotPasswordSuccess } from '~pages/Auth/forgot-password-success'
import { SignIn } from '~pages/Auth/sign-in'
import { SignUpCaregiver } from '~pages/Auth/sign-up-caregiver'
import { SignUpDoctor } from '~pages/Auth/sign-up-doctor'
import { SignUpPatient } from '~pages/Auth/sign-up-patient'
import { GrantedUserAccount } from '~pages/GrantedUser/Account/granted-user-account'
import { GrantedUserPatient } from '~pages/GrantedUser/Patient/granted-user-patient'
import { GrantedUserPatients } from '~pages/GrantedUser/Patients/granted-user-patients'
import { GrantedUserRequest } from '~pages/GrantedUser/Requests/granted-user-request'
import { PatientAccount } from '~pages/Patient/Account/patient-account'
import { PatientEmergencyContacts } from '~pages/Patient/EmergencyContacts/patient-emergency-contacts'
import { PatientGrantedUsers } from '~pages/Patient/GrantedUsers/patient-granted-users'
import { PatientRequests } from '~pages/Patient/Requests/patient-requests'
import { PatientVitals } from '~pages/Patient/Vitals/patient-vitals'
import { CookiesPolicy } from '~pages/StaticPages/cookies-policy'
import { PrivacyPolicy } from '~pages/StaticPages/privacy-policy'
import { TermsAndConditions } from '~pages/StaticPages/terms-and-conditions'
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
        <Route element={<SignUpCaregiver />} path={PageUrls.SignUpCaregiver} />
        <Route element={<EmailVerification />} path={PageUrls.EmailVerification} />
      </Route>
      <Route element={<DefaultLayout />}>
        {isUserRoleGrantable(userRole) ? (
          <>
            <Route element={<GrantedUserAccount />} path={PageUrls.MyAccount} />
            <Route element={<GrantedUserPatients />} path={PageUrls.Patients} />
            <Route element={<GrantedUserPatient />} path={`${PageUrls.Patient}/:patientUserId`} />
            <Route element={<GrantedUserRequest />} path={PageUrls.Requests} />
          </>
        ) : (
          <>
            <Route element={<PatientAccount />} path={PageUrls.MyAccount} />
            <Route element={<PatientVitals />} path={PageUrls.Vitals} />
            <Route element={<PatientEmergencyContacts />} path={PageUrls.EmergencyContacts} />
            <Route element={<PatientGrantedUsers />} path={PageUrls.GrantedUsers} />
            <Route element={<PatientRequests />} path={PageUrls.Requests} />
          </>
        )}
      </Route>
      <Route element={<StaticLayout />}>
        <Route element={<PrivacyPolicy />} path={PageUrls.PrivacyPolicy} />
        <Route element={<TermsAndConditions />} path={PageUrls.TermsAndConditions} />
        <Route element={<CookiesPolicy />} path={PageUrls.CookiesPolicy} />
      </Route>
      <Route element={<AccountRecovery />} path={PageUrls.AccountRecovery} />
      <Route element={<AddEmergencyContact />} path={PageUrls.AddEmergencyContact} />
      <Route element={<Navigate to="/" />} path="*" />
    </Routes>
  )
}
