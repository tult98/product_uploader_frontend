import React, { useContext, useMemo } from 'react'
import NavigationItem from './NavigationItem'
import Logout from './Logout'
import AuthenticationContext from 'context/AuthenticationContext'
import { getNavigationItems } from 'utils/commonUtils'

const NavigationAuth = () => {
  const { user } = useContext(AuthenticationContext)

  const navigationItems = useMemo(() => {
    return getNavigationItems(user.is_staff)
  }, [user.is_staff])

  return (
    <div className="fixed flex flex-col w-1/6 h-full bg-gray-800 text-white100">
      {navigationItems.map((navigationItem, index) => (
        <NavigationItem
          key={index}
          name={navigationItem.name}
          route={navigationItem.route}
          child={navigationItem.child}
        />
      ))}
      <Logout />
    </div>
  )
}

export default NavigationAuth
