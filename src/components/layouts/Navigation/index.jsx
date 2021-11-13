import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import NavigationAuth from './NavigationAuth'
import NavigationNonAuth from './NavigationNonAuth'
import AuthenticationContext from 'context/AuthenticationContext'
import { GENERAL_ROUTES } from 'routes'

const Navigation = () => {
  const location = useLocation()
  const { user } = useContext(AuthenticationContext)

  return user ? <NavigationAuth /> : !location.pathname === GENERAL_ROUTES.LOGIN ? <NavigationNonAuth /> : ''
}

export default Navigation
