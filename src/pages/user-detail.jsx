import LoadingIndicator from 'components/elements/LoadingIndicator'
import NotFound404 from 'components/screens/NotFound404'
import UserInput from 'components/screens/UserInput'
import ErrorIndicator from 'components/widgets/ErrorIndicator'
import IntroducePage from 'components/widgets/IntroducePage'
import { useAuthorization } from 'hooks/useAuthorization'
import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import AuthServices from 'services/AuthService'

const UserDetailPage = () => {
  const { userId } = useParams()
  const { isLoading, isError, isSuccess, error, data } = useQuery(['query-user', { userId }], AuthServices.queryUser)
  const hasPermission = useAuthorization({ adminRequired: true })
  return (
    <>
      <header>
        <title>Product Uploader | User Details</title>
      </header>
      <div className="main-content">
        {!hasPermission ? (
          <NotFound404 />
        ) : (
          <div className="w-full">
            <IntroducePage
              name="user"
              title="Edit User"
              description="Where you edit your existing users and assign it for your desire employees."
            />
            {isLoading && <LoadingIndicator style="w-16 h-16 center-with-sidebar" />}
            {isError && <ErrorIndicator error={error} />}
            {isSuccess && <UserInput user={data} isEdit={true} />}
          </div>
        )}
      </div>
    </>
  )
}

export default UserDetailPage
