export const REQUIRED_FIELD_ERROR = 'This field is required.'

export const validateTemplateInput = (data, errors, setErrors) => {
  let isValidInput = true
  let newErrors = { ...errors }
  if (!data.name || data.name === '') {
    isValidInput = false
    newErrors = { ...newErrors, name: { message: REQUIRED_FIELD_ERROR } }
  } else {
    newErrors = { ...newErrors, name: null }
  }

  if (!data.productTitle || data.productTitle === '') {
    isValidInput = false
    newErrors = { ...newErrors, 'product title': { message: REQUIRED_FIELD_ERROR } }
  } else {
    newErrors = { ...newErrors, 'product title': null }
  }

  if (!data.description || data.description === '') {
    isValidInput = false
    newErrors = { ...newErrors, description: { message: REQUIRED_FIELD_ERROR } }
  } else {
    newErrors = { ...newErrors, description: null }
  }

  setErrors(newErrors)
  return isValidInput
}

export const validatePrice = (price) => {
  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return false
  }
  return true
}

export const validateVariationPrice = (data, errors, setErrors) => {
  let newErrors = { ...errors }

  newErrors =
    Number(data.salePrice) > Number(data.regularPrice)
      ? { ...newErrors, price: { message: 'Sale price must be smaller than regular price' } }
      : { ...newErrors, price: null }

  setErrors(newErrors)
}

export const validateSalePrice = (salePrice, errors, setErrors) => {
  if (!salePrice || salePrice === '') {
    setErrors({ ...errors, salePrice: { message: REQUIRED_FIELD_ERROR } })
    return false
  }
  if (validatePrice(salePrice)) {
    setErrors({ ...errors, salePrice: null })
    return true
  }
  setErrors({ ...errors, salePrice: { message: 'Invalid input' } })
  return false
}

export const validateRegularPrice = (regularPrice, errors, setErrors) => {
  if (!regularPrice || regularPrice === '') {
    setErrors({ ...errors, regularPrice: { message: REQUIRED_FIELD_ERROR } })
    return false
  }
  if (validatePrice(regularPrice)) {
    setErrors({ ...errors, regularPrice: null })
    return true
  }
  setErrors({ ...errors, regularPrice: { message: 'Invalid input' } })
  return false
}
