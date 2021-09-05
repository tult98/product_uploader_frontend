export const REQUIRED_FIELD_ERROR = 'This field is required.'

export const validateTemplateInput = (data, errors, setErrors) => {
  let newErrors = { ...errors }
  if (!data.name || data.name === '') {
    newErrors = { ...newErrors, name: { message: REQUIRED_FIELD_ERROR } }
  } else {
    newErrors = { ...newErrors, name: null }
  }

  if (!data.productTitle || data.productTitle === '') {
    newErrors = { ...newErrors, 'product title': { message: REQUIRED_FIELD_ERROR } }
  } else {
    newErrors = { ...errors, 'product title': null }
  }

  if (!data.description || data.description === '') {
    newErrors = { ...newErrors, description: { message: REQUIRED_FIELD_ERROR } }
  } else {
    newErrors = { ...errors, description: null }
  }

  setErrors(newErrors)
}

export const validateAttributeName = (inputText, errors, setErrors) => {
  let newErrors = { ...errors }
  if (!inputText || inputText === '') {
    newErrors = { ...newErrors, name: { message: REQUIRED_FIELD_ERROR } }
  } else {
    newErrors = { ...newErrors, name: null }
  }
  setErrors(newErrors)
}

export const validateAttributeOptions = (options, errors, setErrors) => {
  let newErrors = { ...errors }
  if (!options || options.length === 0) {
    newErrors = { ...newErrors, options: { message: 'Required at least one option' } }
  } else {
    newErrors = { ...newErrors, options: null }
  }
  setErrors(newErrors)
}

export const validatePrice = (price) => {
  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return false
  }
  return true
}

export const validateVariationPrice = (data, errors, setErrors) => {
  let newErrors = { ...errors }
  let isValidInput
  if (!data.salePrice || data.salePrice === '' || !data.regularPrice || data.regularPrice === '') {
    newErrors = { ...newErrors, price: null }
  } else {
    const salePrice = data?.salePrice || ''
    const regularPrice = data?.regularPrice || ''
    isValidInput = validatePrice(salePrice) && validatePrice(regularPrice)
    newErrors = isValidInput
      ? { ...newErrors, price: null }
      : { ...newErrors, price: { message: 'Invalid price input.' } }
    if (isValidInput) {
      newErrors =
        Number(data.salePrice) > Number(data.regularPrice)
          ? { ...newErrors, price: { message: 'Sale price must be smaller than regular price' } }
          : { ...newErrors, price: null }
    }
  }
  setErrors(newErrors)
}
