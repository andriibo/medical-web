import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch } from '~stores/hooks'
import { useDeleteDataAccessMutation } from '~stores/services/patient-data-access.api'
import { setDataAccessHasChanges } from '~stores/slices/data-access.slice'

export const useDeletePatient = () => {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [deletePatient] = useDeleteDataAccessMutation()

  const handleRemovePatient = useCallback(
    async ({ accessId, navigateTo }: { accessId: string; navigateTo?: string }) => {
      try {
        await confirm({
          title: 'Delete a patient?',
          description: 'You will lose access to patient data.',
          confirmationText: 'Delete',
        })

        await deletePatient({ accessId }).unwrap()
        enqueueSnackbar('Patient deleted')
        dispatch(setDataAccessHasChanges(true))
        if (navigateTo) {
          navigate(navigateTo, { replace: true })
        }
      } catch (err) {
        console.error(err)
        if (err) {
          enqueueSnackbar('Patient not deleted', { variant: 'warning' })
        }
      }
    },
    [confirm, deletePatient, dispatch, enqueueSnackbar, navigate],
  )

  return [handleRemovePatient]
}
