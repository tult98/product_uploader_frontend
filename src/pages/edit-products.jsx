import React from 'react'
import UploadProduct from 'components/screens/UploadProduct'
import { useAuthorization } from 'hooks/useAuthorization'
import NotFound404 from 'components/screens/NotFound404'

const EditProductsPage = () => {
  const hasPermission = useAuthorization({ authenticateRequired: true })
  return (
    <>
      <header>
        <title>Product Uploader | Update Products</title>
      </header>
      <div className="main-content">
        {!hasPermission ? (
          <NotFound404 />
        ) : (
          <div className="flex flex-col w-full">
            <UploadProduct isUpdateProduct={true} />
          </div>
        )}
      </div>
    </>
  )
}

export default EditProductsPage
