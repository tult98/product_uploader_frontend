import React from 'react'
import StoreInput from 'components/screens/StoreInput'
import IntroducePage from 'components/widgets/IntroducePage'
import { useAuthorization } from 'hooks/useAuthorization'
import NotFound404 from 'components/screens/NotFound404'

const CreateStorePage = () => {
  const hasPermission = useAuthorization({ adminRequired: true })
  return (
    <>
      <header>
        <title>Product Uploader | Create Store </title>
      </header>
      <div className="main-content">
        {!hasPermission ? (
          <div className="center-inside-main-content">
            <NotFound404 />
          </div>
        ) : (
          <div className="w-full">
            <IntroducePage
              name="store"
              title="Create Store"
              description="Where you create your stores and assign it for your employees."
            />
            <StoreInput />
          </div>
        )}
      </div>
    </>
  )
}

export default CreateStorePage
