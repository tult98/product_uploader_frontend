import React from 'react'
import UploadProduct from 'components/screens/UploadProduct'

const UploadProductPage = () => {
  return (
    <>
      <header>
        <title>Product Uploader | Templates</title>
      </header>
      <div className="flex justify-center main-content">
        <UploadProduct />
      </div>
    </>
  )
}

export default UploadProductPage
