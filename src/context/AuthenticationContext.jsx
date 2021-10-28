import React, { useState, createContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router-dom'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import { GENERAL_ROUTES, NON_NAVIGATION_ROUTES } from 'routes'
import AuthServices from 'services/AuthService'
import { getMe, getRefreshToken, setMe } from 'utils/authUtils'

const AuthenticationContext = createContext()

export const AuthenticationProvider = ({ children }) => {
  const history = useHistory()
  const location = useLocation()
  const [user, setUser] = useState(getMe())
  const refreshToken = getRefreshToken()

  const { status, isError, isSuccess, isLoading, error, data } = useQuery('get-me', AuthServices.getMe, {
    retry: 0,
  })

  useEffect(() => {
    if (isError) {
      if (!NON_NAVIGATION_ROUTES.includes(location.pathname) && error.code === 401) {
        history.push(GENERAL_ROUTES.LOGIN)
      }
    } else if (isSuccess) {
      setUser(data)
      setMe(data)
    }
  }, [status])

  return (
    <>
      <AuthenticationContext.Provider value={{ user, setUser }}>
        {isLoading && refreshToken ? <LoadingIndicator style="w-12 h-12 center-content" /> : <>{children}</>}
      </AuthenticationContext.Provider>
    </>
  )
}

export default AuthenticationContext
