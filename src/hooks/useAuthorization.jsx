import { useContext } from 'react'
import AuthenticationContext from 'context/AuthenticationContext'

export const useAuthorization = ({ authenticateRequired = false, adminRequired = false }) => {
  const { user } = useContext(AuthenticationContext)

  return authenticateRequired ? !!user : adminRequired ? !!user && !!ADMIN_ROLE.includes(user.role) : true
}

export const ADMIN_ROLE = [2, 3]
