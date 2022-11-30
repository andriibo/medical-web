import '~/assets/styles/styles.scss'

import { ConfirmProvider } from 'material-ui-confirm'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app-router'

const App = () => (
  <BrowserRouter>
    <ConfirmProvider
      defaultOptions={{
        dialogProps: { maxWidth: 'xs', fullWidth: true },
        confirmationButtonProps: { variant: 'contained' },
      }}
    >
      <AppRouter />
    </ConfirmProvider>
  </BrowserRouter>
)

export default App
