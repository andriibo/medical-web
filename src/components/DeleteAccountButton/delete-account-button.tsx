import { LoadingButton } from '@mui/lab'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { usePatchDeleteMyAccountMutation } from '~stores/services/profile.api'

import styles from './delete-account-button.module.scss'

export const DeleteAccountButton = () => {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()

  const [deleteAccount, { isLoading: deleteAccountIsLoading }] = usePatchDeleteMyAccountMutation()

  const handleDelete = async () => {
    try {
      await confirm({
        title: 'Delete account?',
        description:
          'You will have the opportunity to recover your account within the next 30 days. After this period, ' +
          "all your account data will be permanently deleted and you won't be able to recover it.",
        confirmationText: 'Delete my account',
      })

      await deleteAccount().unwrap()

      enqueueSnackbar('Account deleted')
      navigate(PageUrls.AccountRecovery, { replace: true })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <LoadingButton
      className={styles.deleteAccountBtn}
      color="inherit"
      loading={deleteAccountIsLoading}
      onClick={handleDelete}
    >
      Delete my account
    </LoadingButton>
  )
}
