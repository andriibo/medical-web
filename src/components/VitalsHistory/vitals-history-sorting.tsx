import { KeyboardArrowDown } from '@mui/icons-material'
import { Button, MenuItem } from '@mui/material'
import React, { FC, useState } from 'react'

import { VitalOrder, VitalOrderKeys } from '~/enums/vital-order.enum'
import { DropdownMenu } from '~components/DropdownMenu/dropdown-menu'
import { getObjectKeys } from '~helpers/get-object-keys'

interface VitalHistorySortingProps {
  sort: VitalOrderKeys
  handleSort: (value: VitalOrderKeys) => void
  buttonVariant?: 'text' | 'outlined' | 'contained'
}

export const VitalsHistorySorting: FC<VitalHistorySortingProps> = ({ sort, handleSort, buttonVariant }) => {
  const [historySort, setHistorySort] = useState<VitalOrderKeys>(sort)
  const [dropClose, setDropClose] = useState(false)

  const handleDrop = (val: boolean) => {
    setDropClose(val)
  }

  const handleOrder = (order: VitalOrderKeys) => {
    setHistorySort(order)
    handleSort(order)
    handleDrop(true)
  }

  return (
    <DropdownMenu
      button={
        <Button endIcon={<KeyboardArrowDown />} variant={buttonVariant}>
          {VitalOrder[historySort]}
        </Button>
      }
      dropClose={dropClose}
      handleDrop={handleDrop}
    >
      {getObjectKeys(VitalOrder).map((order) => (
        <MenuItem key={order} onClick={() => handleOrder(order)} selected={order === historySort}>
          {VitalOrder[order]}
        </MenuItem>
      ))}
    </DropdownMenu>
  )
}
