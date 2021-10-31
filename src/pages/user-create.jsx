import NotFound404 from 'components/screens/NotFound404'
import UserInput from 'components/screens/UserInput'
import { useAuthorization } from 'hooks/useAuthorization'
import React from 'react'

const UserCreatePage = () => {
  const hasPermission = useAuthorization({ adminRequired: true })
  return (
    <>
      <header>
        <title>Product Uploader | New User</title>
      </header>
      <div className="main-content">{!hasPermission ? <NotFound404 /> : <UserInput />}</div>
    </>
  )
}

export default UserCreatePage
