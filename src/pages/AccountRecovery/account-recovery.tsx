import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { ACCOUNT_DELETION_DELAY } from '~constants/constants'
import { useAppDispatch } from '~stores/hooks'
import { usePatchRecoveryMyAccountMutation } from '~stores/services/profile.api'
import { clearPersist, useUserDeletedAt } from '~stores/slices/auth.slice'

import styles from './account-recovery.module.scss'

export const AccountRecovery = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const userDeletedAt = useUserDeletedAt()
  const [isLoading, setIsLoading] = useState(false)
  const dateFormat = 'MMMM D, YYYY'

  const [recoveryAccount] = usePatchRecoveryMyAccountMutation()

  const deletedAt = useMemo(() => {
    const date = userDeletedAt || dayjs().unix()

    return dayjs(date * 1000).format(dateFormat)
  }, [userDeletedAt])

  const permanentlyDeletedAt = useMemo(
    () => dayjs(deletedAt).add(ACCOUNT_DELETION_DELAY, 'day').format(dateFormat),
    [deletedAt],
  )

  const handleLogout = useCallback(async () => {
    setIsLoading(true)
    await dispatch(clearPersist())

    setIsLoading(false)
    navigate(PageUrls.SignIn, { replace: true, state: undefined })
  }, [dispatch, navigate])

  const handleRecovery = async () => {
    try {
      setIsLoading(true)
      await recoveryAccount()

      await handleLogout()

      enqueueSnackbar('Account recovered')
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Something went wrong. Try again', { variant: 'warning' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.deletedContainer}>
      <div className={styles.deletedBox}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          <AlertTitle sx={{ width: '100%', m: 0 }}>
            You requested to delete your account on <br />
            {deletedAt}.
          </AlertTitle>
        </Alert>
        <Typography sx={{ mb: 4 }} variant="body1">
          On <strong>{permanentlyDeletedAt}</strong>, all your account data will be permanently deleted and you won’t be
          able to recover it.
        </Typography>
        <LoadingButton loading={isLoading} onClick={handleRecovery} variant="outlined">
          Recover my account
        </LoadingButton>
        <Box sx={{ mt: 8 }}>
          <Button disabled={isLoading} onClick={handleLogout} variant="text">
            Sign out
          </Button>
        </Box>
      </div>
    </div>
  )
}
