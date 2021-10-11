import React from 'react'
import { navigationItems } from 'utils/commonUtils'
import NavigationItem from './NavigationItem'

const Navigation = () => {
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
    </div>
  )
}

export default Navigation
