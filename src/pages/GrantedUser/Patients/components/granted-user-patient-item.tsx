import { ListItem, ListItemButton, ListItemText, MenuItem } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { PatientCategory } from '~/enums/patient-category'
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
  usePatchPatientCategoryBorderlineMutation,
  usePatchPatientCategoryNormalMutation,
} from '~stores/services/patient-category.api'
import { setDataAccessHasChanges } from '~stores/slices/data-access.slice'

interface GrantedUserPatientItemProps {
  patient: IDoctorPatients
  activeCategory: PatientCategory
}

export const GrantedUserPatientItem: FC<GrantedUserPatientItemProps> = ({ patient, activeCategory }) => {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()
  const [deletePatient] = useDeletePatient()

  const [updateCategoryToBorderline] = usePatchPatientCategoryBorderlineMutation()
  const [updateCategoryToNormal] = usePatchPatientCategoryNormalMutation()

  const [dropClose, setDropClose] = useState(false)
  const handleDrop = useCallback((val: boolean) => {
    setDropClose(val)
  }, [])

  const handleDeletePatient = useCallback(() => {
    setDropClose(true)
    deletePatient({ accessId: patient.accessId })
  }, [deletePatient, patient.accessId])

  const setBorderlineCategory = useCallback(async () => {
    setDropClose(true)
    try {
      await updateCategoryToBorderline({ patientUserId: patient.userId })

      dispatch(setDataAccessHasChanges(true))
      enqueueSnackbar('Moved to Borderline category')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Oops, something went wrong', { variant: 'warning' })
    }
  }, [dispatch, enqueueSnackbar, patient.userId, updateCategoryToBorderline])

  const setNormalCategory = useCallback(async () => {
    setDropClose(true)
    try {
      await updateCategoryToNormal({ patientUserId: patient.userId }).unwrap()

      dispatch(setDataAccessHasChanges(true))
      enqueueSnackbar('Moved to Normal category')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Oops, something went wrong', { variant: 'warning' })
    }
  }, [dispatch, enqueueSnackbar, patient.userId, updateCategoryToNormal])

  const ListItemAction = useMemo(
    () => (
      <DropdownMenu buttonEdge="end" dropClose={dropClose} handleDrop={handleDrop}>
        {activeCategory !== PatientCategory.Normal && <MenuItem onClick={setNormalCategory}>Move to Normal</MenuItem>}
        {activeCategory === PatientCategory.Abnormal && (
          <MenuItem onClick={setBorderlineCategory}>Move to Borderline</MenuItem>
        )}
        <MenuItem onClick={handleDeletePatient}>Delete</MenuItem>
      </DropdownMenu>
    ),
    [activeCategory, dropClose, setBorderlineCategory, handleDeletePatient, handleDrop, setNormalCategory],
  )

  return (
    <ListItem disablePadding key={patient.accessId} secondaryAction={ListItemAction}>
      <ListItemButton component={NavLink} to={`${PageUrls.Patient}/${patient.userId}`}>
        <StyledBadge
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          color={getUserStatusColor(patient.category)}
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
