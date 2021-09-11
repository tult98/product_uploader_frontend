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
