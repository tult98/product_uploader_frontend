import React, { useCallback, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import IntroducePage from 'components/widgets/IntroducePage'
import FileUploadInput from 'components/elements/Input/FileUploadInput'
import ProductInput from 'components/widgets/ProductInput'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import WooServices from 'services/WooServices'
import { REQUIRED_FIELD_ERROR } from 'utils/errorsUtils'
import { PRODUCT_ROUTES } from 'routes'

const UploadProduct = ({ isUpdateProduct = false }) => {
  const history = useHistory()
  const [products, setProducts] = useState([])
  const mutation = useMutation(WooServices.uploadProducts)

  useEffect(() => {
    if (mutation.isError) {
      console.log(mutation.error)
    } else if (mutation.isSuccess) {
      history.push({
        pathname: PRODUCT_ROUTES.GET_LOGS,
        state: mutation.data,
      })
    }
  }, [mutation.status])

  const onUploadProducts = () => {
    if (onValidateTemplate()) {
      mutation.mutate({ data: products, isUpdate: isUpdateProduct })
    }
  }

  const onChangeProducts = useCallback(
    (newProduct, isDelete = false) => {
      const productsUpdater = isDelete
        ? products.filter((product) => {
            return product.sku !== newProduct.sku
          })
        : products.map((product) => {
            if (newProduct.sku === product.sku) {
              product = newProduct
            }
            return product
          })

      setProducts(productsUpdater)
    },
    [products],
  )

  const onValidateTemplate = () => {
    let isValidForm = true
    const newProducts = products.map((product) => {
      if (!product.template) {
        isValidForm = false
        product.errors = { template: REQUIRED_FIELD_ERROR }
      } else {
        product.template.variations.forEach((variation) => {
          if (!variation.image_name) {
            isValidForm = false
            variation.errors = { image_name: REQUIRED_FIELD_ERROR }
          }
        })
      }
      return product
    })
    setProducts(newProducts)
    return isValidForm
  }

  return (
    <>
      {mutation.isLoading && <LoadingIndicator style="w-16 h-16 center-modal -translate-x-7/12 left-7/12" />}
      <div className={`flex flex-col w-full mt-20 ${mutation.isLoading ? 'opacity-20' : ''}`}>
        <IntroducePage
          name="product"
          title={isUpdateProduct ? 'Update your products' : 'Product Uploader'}
          description={
            isUpdateProduct
              ? 'This is where you update your existing products.'
              : 'This is where you upload your products with a desire template.'
          }
        />
        <div className="self-center w-4/5">
          <FileUploadInput setProducts={setProducts} />
          {products &&
            products.length > 0 &&
            products.map((product) => (
              <ProductInput
                key={product.sku}
                product={product}
                onChangeProducts={onChangeProducts}
                isUpdate={isUpdateProduct}
              />
            ))}
          {products && products.length > 0 && (
            <div className="flex justify-center mt-6 mb-12">
              <button className="primary-btn" type="button" onClick={onUploadProducts}>
                {isUpdateProduct ? 'Update products' : 'Upload products'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UploadProduct
