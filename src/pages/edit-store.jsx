import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import StoreInput from 'components/screens/StoreInput'
import IntroducePage from 'components/widgets/IntroducePage'
import NotFound404 from 'components/screens/NotFound404'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import ErrorIndicator from 'components/widgets/ErrorIndicator'
import StoreService from 'services/StoreService'
import AuthenticationContext from 'context/AuthenticationContext'

const EditStorePage = () => {
  const { storeId } = useParams()
  const { isLoading, isError, isSuccess, error, data } = useQuery(['query-store', { storeId }], StoreService.queryStore)
  const { user } = useContext(AuthenticationContext)

  return (
    <>
      <header>
        <title>Product Uploader | Edit Store </title>
      </header>
      <div className="main-content">
        {!user.is_staff ? (
          <div className="fixed transform top-38 left-44">
            <NotFound404 />
          </div>
        ) : (
          <div className="w-full">
            <IntroducePage
              name="store"
              title="Edit Store"
              description="Where you edit your existing stores and assign it for your desire employees."
            />
            {isLoading && <LoadingIndicator style="w-16 h-16 center-modal -translate-x-7/12 left-7/12" />}
            {isError && <ErrorIndicator error={error} />}
            {isSuccess && <StoreInput store={data} isEdit={true} />}
          </div>
        )}
      </div>
    </>
  )
}

export default EditStorePage
