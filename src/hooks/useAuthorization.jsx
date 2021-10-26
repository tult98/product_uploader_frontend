import { useContext } from 'react'
import AuthenticationContext from 'context/AuthenticationContext'

export const useAuthorization = ({ authenticateRequired = false, adminRequired = false }) => {
  const { user } = useContext(AuthenticationContext)

  return authenticateRequired ? !!user : adminRequired ? !!user && !!user.is_staff : true
}
