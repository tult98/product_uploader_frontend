import React, { useContext } from 'react'
import StoreList from 'components/screens/StoreList'
import IntroducePage from 'components/widgets/IntroducePage'
import AuthenticationContext from 'context/AuthenticationContext'
import NotFound404 from 'components/screens/NotFound404'

const ListStorePage = () => {
  const { user } = useContext(AuthenticationContext)

  return (
    <>
      <header>
        <title>Product Uploader | Stores</title>
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
