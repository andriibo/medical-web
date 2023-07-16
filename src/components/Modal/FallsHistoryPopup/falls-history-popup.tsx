import { VitalsItem } from '@abnk/medical-support/src/history-vitals/domain/vitals-item'
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
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { btnClosePopup } from '~/assets/styles/styles-scheme'
import { VitalOrderKeys } from '~/enums/vital-order.enum'
import { VitalsHistorySorting } from '~components/VitalsHistory/vitals-history-sorting'
import { vitalsItemMapper } from '~helpers/history-item-adapter'
import iconManFalling from '~images/icon-man-falling.svg'
import { db } from '~stores/helpers/db'

interface FallsHistoryPopupProps {
  open: boolean
  handleClose: () => void
}

export const FallsHistoryPopup: FC<FallsHistoryPopupProps> = ({ open, handleClose }) => {
  const [historySort, setHistorySort] = useState<VitalOrderKeys>('recent')

  const vitalsFromDb = useLiveQuery(() => db.vitals.toArray().then((vitals) => vitals.map((vital) => vital.items)))

  const [vitalsData, setVitalsData] = useState<VitalsItem[]>()

  useEffect(() => {
    if (vitalsFromDb) {
      setVitalsData([...vitalsItemMapper(vitalsFromDb).filter(({ fall }) => fall)])
    }
  }, [vitalsFromDb])

  const sortedVitals = useMemo(
    () =>
      vitalsData?.sort((a, b) => {
        if (historySort === 'recent') {
          return b.endTimestamp - a.endTimestamp
        }

        return a.endTimestamp - b.endTimestamp
      }),
    [vitalsData, historySort],
  )

  const fallItem = (vital: VitalsItem) => (
    <ListItem disableGutters key={vital.endTimestamp}>
      <ListItemAvatar sx={{ mr: 2, minWidth: '50px', height: '43px' }}>
        <img alt="Fall" src={iconManFalling} />
      </ListItemAvatar>
      <ListItemText primary={dayjs(vital.endTimestamp * 1000).format('MMM DD, h:mm:ss A')} />
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
        </DialogContent>
      </Dialog>
    </>
  )
}
