import React from 'react'
import { navigationItems } from 'utils/commonUtils'
import NavigationItem from './NavigationItem'

const Navigation = () => {
  return (
    <div className="fixed flex flex-col w-1/6 h-full bg-gray-800 text-white100">
      {navigationItems.map((navigationItem) => (
        <NavigationItem
          key="name"
          name={navigationItem.name}
          route={navigationItem.route}
          child={navigationItem.child}
        />
      ))}
      {/* <Link to={GENERAL_ROUTES.HOME} className="navigation-item">
        <Icon name="home" style="w-12 h-12 mr-4" fill={colors.white100} />
        Home
      </Link>
      <Link to={TEMPLATE_ROUTES.LIST_TEMPLATE} className="navigation-item">
        <Icon name="template" style="w-12 h-12 mr-4" fill={colors.white100} />
        Template
      </Link>
      <Link to={PRODUCT_ROUTES.LIST_PRODUCT} className="navigation-item">
        <Icon name="product" style="w-12 h-12 mr-4" fill={colors.white100} />
        Product
      </Link> */}
    </div>
  )
}

export default Navigation
