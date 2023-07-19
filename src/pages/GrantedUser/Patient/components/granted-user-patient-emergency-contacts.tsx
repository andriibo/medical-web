import { PersonAdd } from '@mui/icons-material'
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { FC, useState } from 'react'

import { EmergencyContactTab } from '~/enums/emergency-contact-tab.enum'
import { EmergencyContacts } from '~components/EmergencyContacts/emergency-contacts'
import { SuggestedContactPopup } from '~components/Modal/SuggestedContactPopup/suggested-contact-popup'
import { SuggestedContacts } from '~components/SuggestedContacts/suggested-contacts'
import { TabPanel } from '~components/TabPanel/tab-panel'

interface GrantedUserPatientEmergencyContactsProps {
  patientUserId: string
}

export const GrantedUserPatientEmergencyContacts: FC<GrantedUserPatientEmergencyContactsProps> = ({
  patientUserId,
}) => {
  const [activeTab, setActiveTab] = useState<EmergencyContactTab>(EmergencyContactTab.Existing)
  const [suggestedContactPopupOpen, setSuggestedContactPopupOpen] = useState(false)

  const handleChangeTab = (event: React.SyntheticEvent, value: EmergencyContactTab) => {
    if (value !== null) {
      setActiveTab(value)
    }
  }

  const handleSuggestedContactPopupOpen = () => {
    setSuggestedContactPopupOpen(true)
  }

  const handleSuggestedContactPopupClose = () => {
    setSuggestedContactPopupOpen(false)
  }

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid>
          <ToggleButtonGroup color="primary" exclusive onChange={handleChangeTab} size="small" value={activeTab}>
            <ToggleButton value={EmergencyContactTab.Existing}>Existing</ToggleButton>
            <ToggleButton value={EmergencyContactTab.Suggested}>Suggested by Me</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid mdOffset="auto">
          <Button onClick={handleSuggestedContactPopupOpen} startIcon={<PersonAdd />} variant="outlined">
            Suggest contact
          </Button>
        </Grid>
      </Grid>
      <TabPanel activeTab={activeTab} value={EmergencyContactTab.Existing}>
        <EmergencyContacts patientUserId={patientUserId} />
      </TabPanel>
      <TabPanel activeTab={activeTab} value={EmergencyContactTab.Suggested}>
        <SuggestedContacts patientUserId={patientUserId} />
      </TabPanel>
      <SuggestedContactPopup
        handleClose={handleSuggestedContactPopupClose}
        open={suggestedContactPopupOpen}
        patientUserId={patientUserId}
      />
    </>
  )
}
