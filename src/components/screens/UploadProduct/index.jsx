import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import IntroducePage from 'components/widgets/IntroducePage'
import FileUploadInput from 'components/elements/Input/FileUploadInput'
import ProductInput from 'components/widgets/ProductInput'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import WooServices from 'services/WooServices'
import { REQUIRED_FIELD_ERROR } from 'utils/errorsUtils'
import { PRODUCT_ROUTES } from 'routes'
import StoreInput from 'components/elements/Input/StoreInput'
import AuthenticationContext from 'context/AuthenticationContext'

const UploadProduct = ({ isUpdateProduct = false }) => {
  const history = useHistory()
  const [products, setProducts] = useState([])
  const [store, setStore] = useState()
  const mutation = useMutation(WooServices.uploadProducts)
  const { user } = useContext(AuthenticationContext)

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
    if (!user.wp_username || !user.wp_password || user.wp_username === '' || user.wp_password === '') {
      alert('You dont have an wordpress account associate with your account yet. Please contact with admin to have it.')
    } else {
      if (onValidateTemplate()) {
        mutation.mutate({
          data: products,
          isUpdate: isUpdateProduct,
          store,
          wpAccount: { username: user.wp_username, password: user.wp_password },
        })
      }
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

  const onSelectStore = (store) => {
    setStore(store)
  }

  return (
    <>
      {mutation.isLoading && <LoadingIndicator style="w-16 h-16 center-with-sidebar" />}
      <div className={`flex flex-col w-full mt-20 ${mutation.isLoading ? 'opacity-20' : ''}`}>
        <IntroducePage name="product" title={isUpdateProduct ? 'Update existed products' : 'Create new products'} />
        <div className="self-center w-4/5">
          <FileUploadInput setProducts={setProducts} />
          {products && products.length > 0 && (
            <StoreInput
              label="Targeted store"
              style="mt-10"
              labelStyle="font-medium capitalize"
              onSelect={onSelectStore}
            />
          )}
          {products &&
            products.length > 0 &&
            products.map((product) => (
              <ProductInput
                key={product.sku}
                product={product}
                onChangeProducts={onChangeProducts}
                isUpdate={isUpdateProduct}
                store={store}
              />
            ))}
          {products && products.length > 0 && (
            <>
              <div className="flex justify-center mt-6 mb-12">
                <button className="primary-btn" type="button" onClick={onUploadProducts}>
                  {isUpdateProduct ? 'Update products' : 'Upload products'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default UploadProduct
