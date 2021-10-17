import React from 'react'
import StoreInput from 'components/screens/StoreInput'
import IntroducePage from 'components/widgets/IntroducePage'

const CreateStorePage = () => {
  return (
    <>
      <header>
        <title>Product Uploader | Create Store </title>
      </header>
      <div className="main-content">
        <div className="w-full">
          <IntroducePage
            name="store"
            title="Create Store"
            description="Where you create your stores and assign it for your employees."
          />
          <StoreInput />
        </div>
      </div>
    </>
  )
}

export default CreateStorePage
