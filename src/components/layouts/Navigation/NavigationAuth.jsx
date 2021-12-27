import React, { useContext, useMemo } from 'react'
import NavigationItem from './NavigationItem'
import Logout from './Logout'
import AuthenticationContext from 'context/AuthenticationContext'
import { getNavigationItems } from 'utils/commonUtils'
import { ADMIN_ROLE } from 'hooks/useAuthorization'

const NavigationAuth = () => {
  const { user } = useContext(AuthenticationContext)

  const navigationItems = useMemo(() => {
    return getNavigationItems(ADMIN_ROLE.includes(user.role))
  }, [user.role])

  return (
    <div className="fixed flex flex-col w-1/6 h-full overflow-y-auto bg-gray-800 text-white100">
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
