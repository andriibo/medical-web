import { Avatar, Box, Button, Divider, Typography } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { getAcronym } from '~helpers/get-acronym'
import { getAge } from '~helpers/get-age'
import { IPatientProfile } from '~models/profie.model'
import { useDeleteDataAccessMutation } from '~stores/services/patient-data-access.api'

import styles from '../doctor-patient.module.scss'

interface DoctorPatientInfoProps {
  patientData: IPatientProfile
}

export const DoctorPatientInfo: FC<DoctorPatientInfoProps> = ({ patientData }) => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const [deletePatient] = useDeleteDataAccessMutation()

  const fullName = useMemo(() => `${patientData?.firstName} ${patientData?.lastName}`, [patientData])

  const handleRemovePatient = useCallback(
    async (accessId: string) => {
      try {
        await confirm({
          title: 'Remove patient?',
          description: 'You will lose access to patient data.',
          confirmationText: 'Remove',
        })

        await deletePatient({ accessId }).unwrap()
        enqueueSnackbar('Patient removed')
        navigate(PageUrls.Patients, { replace: true })
      } catch (err) {
        console.error(err)
        if (err) {
          enqueueSnackbar('Patient not removed', { variant: 'warning' })
        }
      }
    },
    [confirm, deletePatient, enqueueSnackbar, navigate],
  )

  return (
    <div className={styles.patientAside}>
      <Avatar className={styles.userAvatar}>{getAcronym(fullName)}</Avatar>
      <Typography textAlign="center" variant="body1">
        {fullName}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <ul className={styles.personalInfoList}>
        <li>
          <span className={styles.infoListLabel}>Gender</span>
          {patientData.gender}
        </li>
        <li>
          <span className={styles.infoListLabel}>Age</span>
          {getAge(patientData.dob)}
        </li>
        <li>
          <span className={styles.infoListLabel}>Height</span>
          {patientData.height} cm
        </li>
        <li>
          <span className={styles.infoListLabel}>Weight</span>
          {patientData.weight} kg
        </li>
      </ul>
      <Divider sx={{ my: 2 }} />
      <ul className={`${styles.personalInfoList} ${styles.fullWidth}`}>
        <li>
          <span className={styles.infoListLabel}>Phone</span>+{patientData.phone}
        </li>
        <li>
          <span className={styles.infoListLabel}>Email</span>
          <span className="text-ellipsis" title={patientData.email}>
            {patientData.email}
          </span>
        </li>
      </ul>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button color="error" onClick={() => handleRemovePatient(patientData.userId)} variant="outlined">
          Remove
        </Button>
      </Box>
    </div>
  )
}
