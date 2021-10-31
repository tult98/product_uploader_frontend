import React from 'react'
import NotFound404 from 'components/screens/NotFound404'
import UserInput from 'components/screens/UserInput'
import IntroducePage from 'components/widgets/IntroducePage'
import { useAuthorization } from 'hooks/useAuthorization'

const UserCreatePage = () => {
  const hasPermission = useAuthorization({ adminRequired: true })
  return (
    <>
      <header>
        <title>Product Uploader | New User</title>
      </header>
      <div className="main-content">
        {!hasPermission ? (
          <NotFound404 />
        ) : (
          <div className="w-full mt-20">
            <IntroducePage name="user" title="Create user" description="This is where you create a new user." />
            <UserInput />
          </div>
        )}
      </div>
    </>
  )
}

export default UserCreatePage
