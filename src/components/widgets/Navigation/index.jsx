// import Icon from 'components/elements/Icon'
import React from 'react'
import { Link } from 'react-router-dom'
import { GENERAL_ROUTES, PRODUCT_ROUTES, TEMPLATE_ROUTES } from 'routes'

const Navigation = () => {
  return (
    <div className="fixed flex flex-row items-center w-full text-white bg-gray-800 h-28">
      {/* <Icon name="logo" fill="#ffffff" style="w-12 h-48 mx-8" /> */}
      <div className="navigation-item">
        <Link to={GENERAL_ROUTES.HOME}>Home</Link>
      </div>
      <div className="navigation-item">
        <Link to={TEMPLATE_ROUTES.LIST_TEMPLATE}>Template</Link>
      </div>
      <div className="navigation-item">
        <Link to={PRODUCT_ROUTES.LIST_PRODUCT}>Product</Link>
      </div>
    </div>
  )
}

export default Navigation
