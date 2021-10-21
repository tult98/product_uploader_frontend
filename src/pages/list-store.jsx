import React from 'react'
import StoreList from 'components/screens/StoreList'
import IntroducePage from 'components/widgets/IntroducePage'

const ListStorePage = () => {
  return (
    <>
      <header>
        <title>Product Uploader | Stores</title>
      </header>
      <div className="main-content">
        <div className="w-full">
          <IntroducePage name="store" title="Store Dashboard" description="This is where you control all your store." />
          <StoreList />
        </div>
      </div>
    </>
  )
}

export default ListStorePage
