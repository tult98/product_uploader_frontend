import { REQUIRED_FIELD_ERROR } from './errorsUtils'

export const validateSKU = (sku, variations, errors, setErrors) => {
  variations.map((variation) => {
    if (!variation.sku || variation.sku === '') {
      setErrors({ ...errors, sku: null })
    }
    let count = 0
    for (const variation of variations) {
      if (variation.sku === sku) {
        count += 1
      }
    }
    count > 1 ? setErrors({ ...errors, sku: 'SKU is duplicated' }) : setErrors({ ...errors, sku: null })
  })
}

export const validateRequired = (value) => {
  if (!value || value === '') {
    return REQUIRED_FIELD_ERROR
  }
  return null
}

export const validateFileType = (files) => {
  let error = ''
  Object.values(files).every((file) => {
    if (!file.type.includes('image')) {
      error = 'Please only upload image files'
      return false
    }
    return true
  })
  if (error === '') {
    Object.values(files).every((file) => {
      if (file.webkitRelativePath.split('/').length !== 3) {
        error = 'Please upload the correct folder structure'
        return false
      }
      return true
    })
  }
  return error
}
