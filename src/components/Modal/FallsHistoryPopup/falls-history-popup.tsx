import { Close } from '@mui/icons-material'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import dayjs from 'dayjs'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { btnClosePopup } from '~/assets/styles/styles-scheme'
import { VitalOrderKeys } from '~/enums/vital-order.enum'
import { Spinner } from '~components/Spinner/spinner'
import { VitalsHistorySorting } from '~components/VitalsHistory/vitals-history-sorting'
import iconManFalling from '~images/icon-man-falling.svg'
import { IVital } from '~models/vital.model'
import { useGetPatientVitalsByDoctorQuery, useGetPatientVitalsQuery } from '~stores/services/vitals.api'

interface FallsHistoryPopupProps {
  patientUserId?: string
  open: boolean
  handleClose: () => void
}

export const FallsHistoryPopup: FC<FallsHistoryPopupProps> = ({ patientUserId, open, handleClose }) => {
  const startDate = useMemo(() => dayjs().subtract(30, 'days').toISOString(), [])
  const endDate = useMemo(() => dayjs().toISOString(), [])
  const [historySort, setHistorySort] = useState<VitalOrderKeys>('recent')

  const [vitalsData, setVitalsData] = useState<IVital[]>()
  const [isLoading, setIsLoading] = useState(false)

  const { data: myVitalsData, isLoading: myVitalsIsLoading } = useGetPatientVitalsQuery(
    patientUserId ? skipToken : { startDate, endDate },
  )
  const { data: patientVitalsData, isLoading: patientVitalsIsLoading } = useGetPatientVitalsByDoctorQuery(
    patientUserId ? { patientUserId, startDate, endDate } : skipToken,
  )

  useEffect(() => {
    if (myVitalsData) {
      setVitalsData([...myVitalsData.vitals.filter(({ fall }) => fall)])
    }

    if (patientVitalsData) {
      setVitalsData([...patientVitalsData.vitals.filter(({ fall }) => fall)])
    }
  }, [myVitalsData, patientVitalsData])

  useEffect(() => {
    setIsLoading(myVitalsIsLoading || patientVitalsIsLoading)
  }, [myVitalsIsLoading, patientVitalsIsLoading])

  const sortedVitals = useMemo(
    () =>
      vitalsData?.sort((a, b) => {
        if (historySort === 'recent') {
          return b.timestamp - a.timestamp
        }

        return a.timestamp - b.timestamp
      }),
    [vitalsData, historySort],
  )

  const fallItem = (vital: IVital) => (
    <ListItem disableGutters key={vital.timestamp}>
      <ListItemAvatar sx={{ mr: 2, minWidth: '50px', height: '43px' }}>
        <img alt="Fall" src={iconManFalling} />
      </ListItemAvatar>
      <ListItemText primary={dayjs(vital.timestamp * 1000).format('MMM DD, h:mm:ss A')} />
    </ListItem>
  )

  return (
    <>
      <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
        <DialogTitle>
          Falls history {vitalsData?.length ? `(${vitalsData.length})` : null}
          <IconButton onClick={handleClose} sx={btnClosePopup}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogTitle sx={{ pt: 0 }} variant="body1">
          {vitalsData?.length ? (
            <VitalsHistorySorting buttonVariant="outlined" handleSort={setHistorySort} sort={historySort} />
          ) : null}
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Spinner />
          ) : (
            <List className="list-divided">
              {!sortedVitals?.length ? (
                <ListItem className="empty-list-item">No falls detected</ListItem>
              ) : (
                <Virtuoso
                  data={sortedVitals}
                  itemContent={(index, vital) => fallItem(vital)}
                  style={{ height: 60 * sortedVitals.length }}
                />
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
