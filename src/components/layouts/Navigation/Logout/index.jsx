import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Icon from 'components/elements/Icon'
import AuthenticationContext from 'context/AuthenticationContext'
import { colors } from 'theme/variables/platform'
import { logout } from 'utils/authUtils'
import { GENERAL_ROUTES } from 'routes'

const Logout = () => {
  const history = useHistory()
  const { setUser } = useContext(AuthenticationContext)

  const onLogout = () => {
    logout()
    setUser(null)
    history.push(GENERAL_ROUTES.HOME)
  }

  return (
    <div className="navigation-item" onClick={onLogout}>
      <Icon name="logout" style="w-12 h-12 mr-4" fill={colors.white100} />
      Logout
    </div>
  )
}

export default Logout
