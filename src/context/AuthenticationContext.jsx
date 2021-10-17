import React, { useState, createContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import { GENERAL_ROUTES } from 'routes'
import AuthServices from 'services/AuthService'
import { getMe, getRefreshToken, setMe } from 'utils/authUtils'

const AuthenticationContext = createContext()

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(getMe())
  const refreshToken = getRefreshToken()
  const history = useHistory()

  const { status, isError, isSuccess, isLoading, data } = useQuery('get-me', AuthServices.getMe, {
    retry: 0,
  })

  useEffect(() => {
    if (isError) {
      history.push(GENERAL_ROUTES.HOME)
    } else if (isSuccess) {
      setUser(data)
      setMe(data)
    }
  }, [status])

  return (
    <>
      {refreshToken && isLoading ? (
        <LoadingIndicator style="w-12 h-12 center-content" />
      ) : (
        <AuthenticationContext.Provider value={{ user, setUser }}>{children}</AuthenticationContext.Provider>
      )}
    </>
  )
}

export default AuthenticationContext