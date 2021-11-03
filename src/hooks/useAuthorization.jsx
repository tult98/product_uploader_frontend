import { useContext } from 'react'
import AuthenticationContext from 'context/AuthenticationContext'

export const useAuthorization = ({ authenticateRequired = false, adminRequired = false }) => {
  const { user } = useContext(AuthenticationContext)

  if (adminRequired) {
    return !!user && !!ADMIN_ROLE.includes(user.role)
  } else if (authenticateRequired) {
    return !!user
  }
  return true
}

export const ADMIN_ROLE = [2, 3]
