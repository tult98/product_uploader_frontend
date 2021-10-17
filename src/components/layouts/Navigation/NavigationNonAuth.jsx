import React from 'react'
import { useHistory } from 'react-router-dom'
import { GENERAL_ROUTES } from 'routes'

const NavigationNonAuth = () => {
  const history = useHistory()

  const onLogin = () => {
    history.push(GENERAL_ROUTES.LOGIN)
  }

  return (
    <div className="fixed top-0 flex justify-end w-full bg-gray-800 h-28 text-white100">
      <button type="button" onClick={onLogin} className="h-full px-12 text-3xl font-medium hover:bg-gray-600">
        Login
      </button>
    </div>
  )
}

export default NavigationNonAuth
