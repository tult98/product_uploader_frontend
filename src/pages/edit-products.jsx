import React from 'react'
import UploadProduct from 'components/screens/UploadProduct'

const EditProductsPage = () => {
  return (
    <>
      <header>
        <title>Product Uploader | Edit Products</title>
      </header>
      <div className="main-content">
        <div className="flex flex-col w-full">
          <UploadProduct isUpdateProduct={true} />
        </div>
      </div>
    </>
  )
}

export default EditProductsPage
