import React from 'react'
import { useHistory } from 'react-router-dom'
import Login from 'components/screens/Login'
import { GENERAL_ROUTES } from 'routes'
import { getMe } from 'utils/authUtils'
import LoadingIndicator from 'components/elements/LoadingIndicator'

const LoginPage = () => {
  const history = useHistory()
  const me = getMe()

  if (me) {
    history.push(GENERAL_ROUTES.HOME)
  }
  return (
    <>
      <header>
        <title>Product Uploader | Login</title>
      </header>
      <LoadingIndicator style="w-16 h-16 center-with-sidebar" />
      {me ? <LoadingIndicator style="w-16 h-16 center-with-sidebar" /> : <Login />}
    </>
  )
}

export default LoginPage
