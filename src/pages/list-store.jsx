import React from 'react'
import StoreList from 'components/screens/StoreList'
import IntroducePage from 'components/widgets/IntroducePage'
import NotFound404 from 'components/screens/NotFound404'
import { useAuthorization } from 'hooks/useAuthorization'

const ListStorePage = () => {
  const hasPermission = useAuthorization({ adminRequired: true })

  return (
    <>
      <header>
        <title>Product Uploader | Stores</title>
      </header>
      <div className="main-content">
        {!hasPermission ? (
          <NotFound404 />
        ) : (
          <div className="w-full mt-20">
            <IntroducePage
              name="store"
              title="Store Dashboard"
              description="This is where you control all your store."
            />
            <StoreList />
          </div>
        )}
      </div>
    </>
  )
}

export default ListStorePage
