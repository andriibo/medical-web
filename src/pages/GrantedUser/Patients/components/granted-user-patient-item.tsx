import { ListItem, ListItemButton, ListItemText, MenuItem } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { PatientStatus } from '~/enums/patient-status.enum'
import { useDeletePatient } from '~/hooks/use-delete-patient'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { LastConnected } from '~components/LastConnected/last-connected'
import { StyledBadge } from '~components/StyledBadge/styled-badge'
import { UserAvatar } from '~components/UserAvatar/user-avatar'
import { getRequestedUserName } from '~helpers/get-requested-user-name'
import { getUserStatusColor } from '~helpers/get-user-status-color'
import { IDoctorPatients } from '~models/profie.model'
import { useAppDispatch } from '~stores/hooks'
import {
  usePutPatientStatusAbnormalMutation,
  usePutPatientStatusBorderlineMutation,
  usePutPatientStatusNormalMutation,
} from '~stores/services/patient-status.api'
import { setDataAccessHasChanges } from '~stores/slices/data-access.slice'

interface GrantedUserPatientItemProps {
  patient: IDoctorPatients
  activeCategory: PatientStatus
}

export const GrantedUserPatientItem: FC<GrantedUserPatientItemProps> = ({ patient, activeCategory }) => {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()
  const [deletePatient] = useDeletePatient()

  const [updateStatusToBorderline] = usePutPatientStatusBorderlineMutation()
  const [updateStatusToNormal] = usePutPatientStatusNormalMutation()
  const [updateStatusToAbnormal] = usePutPatientStatusAbnormalMutation()

  const [dropClose, setDropClose] = useState(false)
  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  const handleDeletePatient = useCallback(() => {
    setDropClose(true)
    deletePatient({ accessId: patient.accessId })
  }, [deletePatient, patient.accessId])

  const setAbnormalStatus = useCallback(async () => {
    setDropClose(true)
    try {
      await updateStatusToAbnormal({ patientUserId: patient.userId })

      dispatch(setDataAccessHasChanges(true))
      enqueueSnackbar('Moved to Abnormal')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Oops, something went wrong', { variant: 'warning' })
    }
  }, [dispatch, enqueueSnackbar, patient.userId, updateStatusToAbnormal])

  const setBorderlineStatus = useCallback(async () => {
    setDropClose(true)
    try {
      await updateStatusToBorderline({ patientUserId: patient.userId })

      dispatch(setDataAccessHasChanges(true))
      enqueueSnackbar('Moved to Borderline')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Oops, something went wrong', { variant: 'warning' })
    }
  }, [dispatch, enqueueSnackbar, patient.userId, updateStatusToBorderline])

  const setNormalStatus = useCallback(async () => {
    setDropClose(true)
    try {
      await updateStatusToNormal({ patientUserId: patient.userId }).unwrap()

      dispatch(setDataAccessHasChanges(true))
      enqueueSnackbar('Moved to Normal')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Oops, something went wrong', { variant: 'warning' })
    }
  }, [dispatch, enqueueSnackbar, patient.userId, updateStatusToNormal])

  const ListItemAction = useMemo(
    () => (
      <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
        {activeCategory !== PatientStatus.Abnormal && <MenuItem onClick={setAbnormalStatus}>Move to Abnormal</MenuItem>}
        {activeCategory !== PatientStatus.Borderline && (
          <MenuItem onClick={setBorderlineStatus}>Move to Borderline</MenuItem>
        )}
        {activeCategory !== PatientStatus.Normal && <MenuItem onClick={setNormalStatus}>Move to Normal</MenuItem>}
        <MenuItem onClick={handleDeletePatient}>Delete</MenuItem>
      </DropdownMenu>
    ),
    [
      activeCategory,
      dropClose,
      setBorderlineStatus,
      setAbnormalStatus,
      setNormalStatus,
      handleDeletePatient,
      handleDrop,
    ],
  )

  return (
    <ListItem disablePadding key={patient.accessId} secondaryAction={ListItemAction}>
      <ListItemButton component={NavLink} to={`${PageUrls.Patient}/${patient.userId}`}>
        <StyledBadge
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          color={getUserStatusColor(patient.status)}
          overlap="circular"
          sx={{ mr: 2 }}
          variant="dot"
        >
          <UserAvatar avatar={patient.avatar} firstName={patient.firstName} lastName={patient.lastName} />
        </StyledBadge>
        <ListItemText
          primary={getRequestedUserName(patient)}
          secondary={<LastConnected lastConnected={patient.lastConnected} />}
        />
      </ListItemButton>
    </ListItem>
  )
}
