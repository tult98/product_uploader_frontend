import { formatDate } from './dateUtils'

export const UPLOAD_SUCCESS_MESSAGE = 'Upload product successful'
export const UPLOAD_VARIATION_SUCCESS_MESSAGE = 'Upload variation successful'
export const UPLOAD_UNKNOWN_MESSAGE = 'Unknown error'
export const UPLOAD_STATUS = {
  SUCCESS: 'Success',
  ERROR: 'Error',
  WARN: 'Warn',
}

export const handleFileUploadData = (selectedFiles) => {
  // TODO: group multiple files have the same Relative path
  const groupRelativePaths = []
  selectedFiles.forEach((file) => {
    const relativePath = file.webkitRelativePath.split('/').slice(1, 2)[0]
    if (!groupRelativePaths.includes(relativePath)) {
      groupRelativePaths.push(relativePath)
    }
  })

  const products = groupRelativePaths.map((relativePath) => {
    const productData = {
      sku: relativePath,
      files: [],
    }

    selectedFiles.map((file) => {
      if (file.webkitRelativePath.includes(relativePath)) {
        productData.files = [...productData.files, file]
      }
    })
    return productData
  })
  return products
}

export const traverseFileTree = async (item) => {
  const uploadFiles = {}
  const dirReader = item.createReader()
  dirReader.readEntries(async (entries) => {
    entries.map((entry, index) => {
      entry.file((file) => {
        uploadFiles[index] = file
      })
    })
  })
  return uploadFiles
}

export const handleProductData = (data, imagesData) => {
  let default_attributes = []
  const attributes = data.attributes.map((attribute, index) => {
    default_attributes.push({
      name: attribute.name,
      option: attribute.options.find((option) => option.is_default).name,
    })
    return {
      name: attribute.name,
      visible: true,
      variation: true,
      position: index,
      options: attribute.options.map((option) => option.name),
    }
  })
  data.attributes = attributes
  data.images = imagesData
  data.default_attributes = default_attributes
  delete data.id

  return data
}

export const handleProductVariationsData = (variations, product) => {
  const formatVariations = variations.map((variation) => {
    delete variation.id // TODO: make a change at backend to not return variation's id later
    const attributesByName = {}
    product.attributes.forEach((attribute) => {
      attributesByName[attribute.name] = {
        id: attribute.id,
        name: attribute.name,
      }
    })
    const newAttributes = variation.attributes.map((variationAttribute) => {
      return {
        id: attributesByName[variationAttribute.name].id,
        name: variationAttribute.name,
        option: variationAttribute.value,
      }
    })

    product.images.forEach((image) => {
      if (image.name.includes(variation.image_name)) {
        variation.image = {
          id: image.id,
        }
      }
    })

    return {
      ...variation,
      sku: `${product.sku}-${variation.sku}`,
      attributes: newAttributes,
      sale_price: variation.sale_price.toString(), // TODO: change type of sale_price field at backend
      regular_price: variation.regular_price.toString(), // TODO: change type of regular_price field at backend
    }
  })

  return formatVariations
}

export const generateImageUrl = (host, productSku, imageName) => {
  const date = formatDate(new Date())
  return `${host}/${date}/${productSku}-${imageName}`
}
