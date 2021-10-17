import React from 'react'
import NavigationItem from './NavigationItem'
import { navigationItems } from 'utils/commonUtils'
import Logout from './Logout'

const NavigationAuth = () => {
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
