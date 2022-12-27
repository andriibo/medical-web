import { Grow } from '@mui/material'
import { ConfirmProvider } from 'material-ui-confirm'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { SnackbarCloseButton } from '~components/SnackbarCloseButton/snackbar-close-button'
import { persistor, store } from '~stores/store'

import App from './App'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SnackbarProvider
        TransitionComponent={Grow}
        action={(snackbarId) => <SnackbarCloseButton snackbarId={snackbarId} />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        autoHideDuration={4000}
        maxSnack={4}
        preventDuplicate
      >
        <ConfirmProvider
          defaultOptions={{
            dialogProps: { maxWidth: 'xs', fullWidth: true },
            confirmationButtonProps: { variant: 'contained' },
          }}
        >
          <App />
        </ConfirmProvider>
      </SnackbarProvider>
    </PersistGate>
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
