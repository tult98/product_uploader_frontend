import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import NavigationAuth from './NavigationAuth'
import NavigationNonAuth from './NavigationNonAuth'
import AuthenticationContext from 'context/AuthenticationContext'
import { NON_NAVIGATION_ROUTES } from 'routes'

const Navigation = () => {
  const location = useLocation()
  const { user } = useContext(AuthenticationContext)

  return user ? <NavigationAuth /> : !NON_NAVIGATION_ROUTES.includes(location.pathname) ? <NavigationNonAuth /> : null
}

export default Navigation
