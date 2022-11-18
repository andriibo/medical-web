import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { PageUrls } from '~/enums/page-urls.enum'
import { useIsAuth } from '~stores/slices/auth.slice'

export const IsAuthCheckWrapper = () => {
  const isAuth = useIsAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate(PageUrls.SignIn)
    }
  }, [])

  if (!isAuth) {
    return null
  }

  return <Outlet />
}
