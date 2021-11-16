import BaseService from 'services/BaseService'
import {
  handleProductData,
  handleProductVariationsData,
  UPLOAD_STATUS,
  UPLOAD_SUCCESS_MESSAGE,
  UPLOAD_UNKNOWN_MESSAGE,
  UPLOAD_VARIATION_SUCCESS_MESSAGE,
} from 'utils/productUtils'
import WPServices from './WPServices'

// const WOO_BASE_URL = 'https://yourgears.net/wp-json/wc/v3'
export const HOST_IMAGE_SERVER = 'https://yourgears.net/wp-content/uploads'
// const CONSUMER_KEY = 'ck_314aa3b442262eee58ab8eb25147e0e89e52a587'
// const CONSUMER_SECRET = 'cs_e17b1d2677df1b12e2ec54540bec0fe37bac5789'
// const authorizeValue = `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`

const getAuthorizeValue = (store) => {
  const url =
    store.domain_name.slice(-1) === '/' ? `${store.domain_name}wp-json/wc/v3` : `${store.domain_name}/wp-json/wc/v3`
  const authorizeValue = `consumer_key=${store.consumer_key}&consumer_secret=${store.secret_key}`
  return { url, authorizeValue }
}

export default class WooServices {
  // TODO: get authorize from selected store
  static async queryCategories({ queryKey }) {
    console.log(queryKey)
    const [_, { searchPattern, store }] = queryKey /* eslint-disable-line */
    const { url, authorizeValue } = getAuthorizeValue(store)
    return await BaseService.get(`/products/categories?search=${searchPattern}&${authorizeValue}`, null, {
      baseURL: url,
    })
  }

  // static async batchCreateAttributes(attributes) {
  //   let globalAttributes, error
  //   const data = {
  //     create: attributes,
  //   }
  //   try {
  //     const result = await BaseService.post(`/products/attributes/batch?${authorizeValue}`, data, {
  //       baseURL: WOO_BASE_URL,
  //     })
  //     globalAttributes = result.create
  //   } catch (e) {
  //     error = e
  //   }
  //   return { globalAttributes, error }
  // }

  static async getProductBySku(sku, authorizeValue, url) {
    return BaseService.get(`/products?sku=${sku}&${authorizeValue}`, null, { baseURL: url })
  }

  static async uploadProduct({ data, store, wpAccount }) {
    const { images, errors } = await WPServices.uploadImages({ data, wpAccount })

    if (errors && errors.length > 0) {
      let message = 'Failed at uploading the following files: '
      errors.map((error) => {
        message += error.file
      })
      return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: message }
    }

    const productData = handleProductData(
      {
        ...data.template,
        sku: data.sku,
        name: data?.name || data.template.product_title,
        categories: data.categories
          ? data.categories.map((category) => {
              return {
                id: category.id,
              }
            })
          : null,
      },
      images,
    )

    try {
      const { url, authorizeValue } = getAuthorizeValue(store)
      const product = await BaseService.post(`/products?${authorizeValue}`, productData, {
        baseURL: url,
      })

      const productVariations = handleProductVariationsData(data.template.variations, product)
      const variationLogs = await WooServices.uploadProductVariations({
        productId: product.id,
        data: productVariations,
        url,
        authorizeValue,
      })

      let productLog = {
        sku: data.sku,
        status: UPLOAD_STATUS.SUCCESS,
        message: UPLOAD_SUCCESS_MESSAGE,
        variations: variationLogs,
      }
      for (const variationLog of variationLogs) {
        if (variationLog.status === UPLOAD_STATUS.ERROR) {
          productLog = { ...productLog, status: UPLOAD_STATUS.WARN }
          break
        }
      }

      return productLog
    } catch (error) {
      images.map(async (item) => {
        await WPServices.deleteImage(item.id, wpAccount)
      })
      return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: error?.errors?.message || UPLOAD_UNKNOWN_MESSAGE }
    }
  }

  // update an existing product
  static async updateProduct({ data, store, wpAccount }) {
    let products
    const { url, authorizeValue } = getAuthorizeValue(store)
    try {
      const result = await WooServices.getProductBySku(data.sku, authorizeValue, url)
      products = Object.values(result)
      if (!products || products.length !== 1) {
        return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: 'Cannot found any product with that SKU.' }
      }
    } catch (error) {
      return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: error.errors.message || UPLOAD_UNKNOWN_MESSAGE }
    }

    const originalProduct = products[0]

    const { images, errors } = await WPServices.uploadImages({ data, wpAccount })

    if (errors && errors.length > 0) {
      let message = 'Failed at uploading the following files: '
      errors.map((error) => {
        message += error.file
      })
      return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: message }
    }

    const productData = handleProductData(
      {
        ...data.template,
        sku: data.sku,
        name: data?.name || data.template.product_title,
        categories: data.categories
          ? data.categories.map((category) => {
              return {
                id: category.id,
              }
            })
          : null,
      },
      images,
    )

    try {
      const product = await BaseService.put(`/products/${originalProduct.id}?${authorizeValue}`, productData, {
        baseURL: url,
      })

      const productVariations = handleProductVariationsData(data.template.variations, product)
      // attach id for a variation
      productVariations.forEach((variation, index) => {
        variation.id = products[0].variations[index]
      })

      const variationLogs = await WooServices.updateProductVariations({
        productId: product.id,
        data: productVariations,
        url,
        authorizeValue,
      })

      // TODO: only delete image after update product success
      const { errors } = await WPServices.deleteImages(originalProduct.images, wpAccount)

      let productLog = {
        sku: data.sku,
        status: UPLOAD_STATUS.SUCCESS,
        message: UPLOAD_SUCCESS_MESSAGE,
        variations: variationLogs,
      }
      if (errors && errors.length > 0) {
        productLog = {
          ...productLog,
          status: UPLOAD_STATUS.WARN,
          message: 'Delete old images is failed',
        }
      }
      for (const variationLog of variationLogs) {
        if (variationLog.status === UPLOAD_STATUS.ERROR) {
          productLog = { ...productLog, status: UPLOAD_STATUS.WARN }
          break
        }
      }

      return productLog
    } catch (error) {
      images.map(async (item) => {
        await WPServices.deleteImage(item.id, wpAccount)
      })
      return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: error?.errors?.message || UPLOAD_UNKNOWN_MESSAGE }
    }
  }

  static async uploadProducts({ data, isUpdate, store, wpAccount }) {
    return await Promise.all(
      data.map(async (productData) => {
        return isUpdate
          ? await WooServices.updateProduct({ data: productData, store, wpAccount })
          : await WooServices.uploadProduct({ data: productData, store, wpAccount })
      }),
    )
  }

  static async uploadProductVariations({ productId, data, url, authorizeValue }) {
    return await Promise.all(
      data.map(async (variation) => {
        let log = { sku: variation.sku }
        try {
          await BaseService.post(`/products/${productId}/variations?${authorizeValue}`, variation, {
            baseURL: url,
          })
          return { ...log, status: UPLOAD_STATUS.SUCCESS, message: UPLOAD_VARIATION_SUCCESS_MESSAGE }
        } catch (error) {
          return { ...log, status: UPLOAD_STATUS.ERROR, message: error?.errors?.message || UPLOAD_UNKNOWN_MESSAGE }
        }
      }),
    )
  }

  static async updateProductVariations({ productId, data, url, authorizeValue }) {
    return await Promise.all(
      data.map(async (variation) => {
        let log = { sku: variation.sku }
        const variationId = variation.id
        delete variation.id
        delete variation.sku
        try {
          await BaseService.put(`/products/${productId}/variations/${variationId}?${authorizeValue}`, variation, {
            baseURL: url,
          })
          return { ...log, status: UPLOAD_STATUS.SUCCESS, message: UPLOAD_VARIATION_SUCCESS_MESSAGE }
        } catch (error) {
          return { ...log, status: UPLOAD_STATUS.ERROR, message: error?.errors?.message || UPLOAD_UNKNOWN_MESSAGE }
        }
      }),
    )
  }

  // static async queryProducts({ queryKey }) {
  //   const sku = queryKey[1].sku
  //   return BaseService.get(`/products?search=${sku}&${authorizeValue}`, null, { baseURL: WOO_BASE_URL })
  // }
}
