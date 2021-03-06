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
// export const HOST_IMAGE_SERVER = 'https://yourgears.net/wp-content/uploads'
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
    const [_, { searchPattern, store }] = queryKey /* eslint-disable-line */
    const { url, authorizeValue } = getAuthorizeValue(store)
    return await BaseService.get(`/products/categories?search=${searchPattern}&${authorizeValue}`, null, {
      baseURL: url,
    })
  }

  static async queryTags({ queryKey }) {
    const [_, { searchPattern, store }] = queryKey /* eslint-disable-line */
    const { url, authorizeValue } = getAuthorizeValue(store)
    return await BaseService.get(`/products/tags?search=${searchPattern}&${authorizeValue}`, null, {
      baseURL: url,
    })
  }

  static async createTagsInBulk(tagsData, store) {
    const { url, authorizeValue } = getAuthorizeValue(store)
    try {
      const results = await Promise.all(
        tagsData.map(async (tagData) => {
          return await BaseService.post(`/products/tags?${authorizeValue}`, tagData, { baseURL: url })
        }),
      )
      return results
    } catch (error) {
      console.error(error)
    }
  }

  static async getProductBySku(sku, authorizeValue, url) {
    return BaseService.get(`/products?sku=${sku}&${authorizeValue}`, null, { baseURL: url })
  }

  static async uploadProduct({ data, store, wpAccount }) {
    const { url, authorizeValue } = getAuthorizeValue(store)
    try {
      const result = await WooServices.getProductBySku(data.sku, authorizeValue, url)
      const products = Object.values(result)
      if (products && products.length > 0) {
        return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: 'Invalid or duplicated SKU' }
      }
    } catch (error) {
      // Cannot check for existing product -> just keep going
      console.error('Failed at checking product existance by SKU')
    }
    const { images, errors } = await WPServices.uploadImages({ data, domainName: store.domain_name, wpAccount })

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
        tags: data.tags.map((tagId) => {
          return { id: tagId }
        }),
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
      await Promise.all(
        images.map(async (item) => {
          await WPServices.deleteImage(item.id, store.domain_name, wpAccount)
        }),
      )

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

    const { images, errors } = await WPServices.uploadImages({ data, domainName: store.domain_name, wpAccount })

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
      const { errors } = await WPServices.deleteImages(originalProduct.images, store.domain_name, wpAccount)

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
        await WPServices.deleteImage(item.id, store.domain_name, wpAccount)
      })
      return { sku: data.sku, status: UPLOAD_STATUS.ERROR, message: error?.errors?.message || UPLOAD_UNKNOWN_MESSAGE }
    }
  }

  static async uploadProducts({ data, isUpdate, store, wpAccount, productTags }) {
    const results = await WooServices.createTagsInBulk(
      productTags.map((tag) => {
        return { name: tag.label }
      }),
      store,
    )

    const tagsByName = {}
    if (results) {
      results.forEach((tag) => {
        tagsByName[tag.name] = tag
      })
    }

    data.forEach((product) => {
      if (product.tags) {
        product.tags = product.tags
          .map((tag) => {
            if (tag.isNewTag) {
              return tagsByName[tag.label]?.id
            } else {
              return tag.value
            }
          })
          .filter((tagId) => tagId !== null && tagId !== undefined)
      }
    })

    const logs = []
    for (const productData of data) {
      const productImageName = productData.template.variations.find(
        (variation) => variation.is_default,
      ).image_name_origin
      const filesByName = {}
      productData.files.forEach((file) => {
        filesByName[file.name] = file
      })
      productData.files = [
        filesByName[productImageName],
        ...productData.files.filter((file) => productImageName !== file.name),
      ]

      let result
      if (isUpdate) {
        result = await WooServices.updateProduct({ data: productData, store, wpAccount })
      } else {
        result = await WooServices.uploadProduct({ data: productData, store, wpAccount })
      }
      logs.push(result)
    }
    return logs
  }

  static async uploadProductVariations({ productId, data, url, authorizeValue }) {
    const uploadVariationLogs = []
    for (const variation of data) {
      let log = { sku: variation.sku }
      try {
        await BaseService.post(`/products/${productId}/variations?${authorizeValue}`, variation, {
          baseURL: url,
        })
        uploadVariationLogs.push({ ...log, status: UPLOAD_STATUS.SUCCESS, message: UPLOAD_VARIATION_SUCCESS_MESSAGE })
      } catch (error) {
        uploadVariationLogs.push({
          ...log,
          status: UPLOAD_STATUS.ERROR,
          message: error?.errors?.message || UPLOAD_UNKNOWN_MESSAGE,
        })
      }
    }
    return uploadVariationLogs
  }

  static async updateProductVariations({ productId, data, url, authorizeValue }) {
    const updateVariationLogs = []
    for (const variation of data) {
      let log = { sku: variation.sku }
      const variationId = variation.id
      delete variation.id
      delete variation.sku
      try {
        await BaseService.put(`/products/${productId}/variations/${variationId}?${authorizeValue}`, variation, {
          baseURL: url,
        })
        updateVariationLogs.push({ ...log, status: UPLOAD_STATUS.SUCCESS, message: UPLOAD_VARIATION_SUCCESS_MESSAGE })
      } catch (error) {
        updateVariationLogs.push({
          ...log,
          status: UPLOAD_STATUS.ERROR,
          message: error?.errors?.message || UPLOAD_UNKNOWN_MESSAGE,
        })
      }
    }
    return updateVariationLogs
  }

  // static async queryProducts({ queryKey }) {
  //   const sku = queryKey[1].sku
  //   return BaseService.get(`/products?search=${sku}&${authorizeValue}`, null, { baseURL: WOO_BASE_URL })
  // }
}
