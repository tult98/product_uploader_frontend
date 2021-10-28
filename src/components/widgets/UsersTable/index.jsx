import LoadingIndicator from 'components/elements/LoadingIndicator'
import AuthenticationContext from 'context/AuthenticationContext'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import AuthServices from 'services/AuthService'
import ErrorIndicator from '../ErrorIndicator'

const UsersTable = () => {
  const [users, setUsers] = useState([])
  const { user } = useContext(AuthenticationContext)
  const { status, isLoading, isError, isSuccess, error, data } = useQuery('query-users', AuthServices.queryUsers)
  useEffect(() => {
    if (isSuccess) {
      const listUser = data.results.filter((usr) => user.id !== usr.id)
      setUsers(listUser)
    }
  }, [status])
  console.log('users', users)
  return (
    <div className="w-full">
      {isLoading && <LoadingIndicator style="w-12 h-12 center-content" />}
      {isError && <ErrorIndicator error={error} />}
      <div className="bg-lightGray">
        <div className="flex flex-row text-xl font-medium text-gray-600 uppercase">
          <div className="w-1/12 px-6 py-6">Index</div>
          <div className="w-1/4 px-6 py-6">Username</div>
          <div className="w-1/4 px-6 py-6">Email</div>
          <div className="w-1/4 px-6 py-6">Full name</div>
          <div className="w-1/6 px-6 py-6">Actions</div>
        </div>
      </div>
    </div>
  )
}

export default UsersTable
