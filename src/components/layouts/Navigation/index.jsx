import React, { useContext } from 'react'
import NavigationAuth from './NavigationAuth'
import NavigationNonAuth from './NavigationNonAuth'
import AuthenticationContext from 'context/AuthenticationContext'

const Navigation = () => {
  const { user } = useContext(AuthenticationContext)

  return user ? <NavigationAuth /> : <NavigationNonAuth />
}

export default Navigation
