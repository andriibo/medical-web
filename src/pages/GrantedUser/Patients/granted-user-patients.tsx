import { PersonAdd } from '@mui/icons-material'
import { Button, List, ListItem, Tab, Tabs, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useCallback, useEffect, useState } from 'react'

import { PatientCategory, PatientCategoryKeys } from '~/enums/patient-category'
import { SearchField } from '~components/Form/Search/search-field'
import { InvitePatientPopup } from '~components/Modal/InvitePatientPopup/invite-patient-popup'
import { Spinner } from '~components/Spinner/spinner'
import { getObjectKeys } from '~helpers/get-object-keys'
import { sortByName } from '~helpers/sort-by-name'
import { IDoctorPatients } from '~models/profie.model'
import { GrantedUserPatientItem } from '~pages/GrantedUser/Patients/components/granted-user-patient-item'
import { useAppDispatch } from '~stores/hooks'
import { useGetMyPatientsQuery } from '~stores/services/profile.api'
import { setDataAccessHasChanges, useDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const GrantedUserPatients = () => {
  const dispatch = useAppDispatch()
  const dataAccessHasChanges = useDataAccessHasChanges()

  const [activeTab, setActiveTab] = useState<PatientCategoryKeys>('Abnormal')
  const [invitePopupOpen, setInvitePopupOpen] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState<IDoctorPatients[] | null>(null)
  const [searchPatients, setSearchPatients] = useState<IDoctorPatients[] | null>(null)

  const {
    data: grantedUserPatients,
    isLoading: grantedUserPatientsIsLoading,
    refetch: refetchGrantedUserPatients,
  } = useGetMyPatientsQuery()

  useEffect(() => {
    if (dataAccessHasChanges) {
      refetchGrantedUserPatients()
      dispatch(setDataAccessHasChanges(false))
    }
  }, [dataAccessHasChanges, dispatch, refetchGrantedUserPatients])

  const handleInvitePopupOpen = () => {
    setInvitePopupOpen(true)
  }

  const handleInvitePopupClose = () => {
    setInvitePopupOpen(false)
  }

  const handleChangeTab = (event: React.SyntheticEvent, value: PatientCategory) => {
    setActiveTab(value)
  }

  useEffect(() => {
    if (grantedUserPatients) {
      const filtered = grantedUserPatients.filter((data) => data.category === activeTab)

      setFilteredPatients(sortByName(filtered))
    }
  }, [grantedUserPatients, activeTab])

  const [isSearching, setIsSearching] = useState(false)

  const onSearch = useCallback(
    (searchText: string) => {
      if (grantedUserPatients) {
        setIsSearching(Boolean(searchText))
        const sss = searchText.split(' ')

        console.log(sss)
        console.log(sss.includes('test'))
        const filtered = grantedUserPatients.filter(({ firstName, lastName }) => {
          const fullName = `${firstName} ${lastName}`

          return fullName.toLowerCase().includes(searchText.toLowerCase())
        })

        setSearchPatients(sortByName(filtered))
      }
    },
    [grantedUserPatients],
  )

  return (
    <>
      <div className="white-box content-md">
        <Grid container spacing={3} sx={{ mb: 1 }}>
          <Grid xs>
            <Typography variant="h5">Patients</Typography>
          </Grid>
          <Grid>
            <SearchField onSearch={onSearch} />
          </Grid>
          <Grid>
            <Button onClick={handleInvitePopupOpen} startIcon={<PersonAdd />} variant="outlined">
              Invite
            </Button>
          </Grid>
        </Grid>
        <Tabs className="tabs" onChange={handleChangeTab} sx={{ mb: 1 }} value={isSearching ? null : activeTab}>
          {getObjectKeys(PatientCategory).map((key) => (
            <Tab disabled={isSearching} key={key} label={PatientCategory[key]} value={key} />
          ))}
          <SearchField onSearch={onSearch} placeholder="Search patients" />
        </Tabs>
        <Typography>Found patients (3)</Typography>
        <List className="list-divided">
          {isSearching ? (
            searchPatients?.length ? (
              searchPatients?.map((patient) => (
                <GrantedUserPatientItem activeCategory={activeTab} key={patient.userId} patient={patient} />
              ))
            ) : (
              <ListItem className="empty-list-item">No results found</ListItem>
            )
          ) : grantedUserPatientsIsLoading ? (
            <Spinner />
          ) : filteredPatients?.length ? (
            filteredPatients.map((patient) => (
              <GrantedUserPatientItem activeCategory={activeTab} key={patient.userId} patient={patient} />
            ))
          ) : (
            <ListItem className="empty-list-item">No patients in this category</ListItem>
          )}
        </List>
      </div>
      <InvitePatientPopup handleClose={handleInvitePopupClose} open={invitePopupOpen} />
    </>
  )
}
