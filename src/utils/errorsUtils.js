export const REQUIRED_FIELD_ERROR = 'This field is required.'
export const UNKNOWN_ERROR_MESSAGE = 'There are unknown errors'

export const validateTemplateInput = (data, errors, setErrors) => {
  let isValidInput = true
  let newErrors = { ...errors }
  if (!data.name || data.name === '') {
    isValidInput = false
    newErrors = { ...newErrors, name: REQUIRED_FIELD_ERROR }
  } else {
    newErrors = { ...newErrors, name: null }
  }

  if (!data.productTitle || data.productTitle === '') {
    isValidInput = false
    newErrors = { ...newErrors, productTitle: REQUIRED_FIELD_ERROR }
  } else {
    newErrors = { ...newErrors, productTitle: null }
  }

  if (!data.description || data.description === '') {
    isValidInput = false
    newErrors = { ...newErrors, description: REQUIRED_FIELD_ERROR }
  } else {
    newErrors = { ...newErrors, description: null }
  }

  // validate attributes
  if (!data.attributes || data.attributes.length === 0) {
    isValidInput = false
    newErrors = { ...newErrors, attributes: 'Please enter an attribute' }
  } else {
    let hasPrimary = false
    data.attributes.map((attribute) => {
      if (attribute.isPrimary) {
        hasPrimary = true
      }
    })
    if (!hasPrimary) {
      isValidInput = false
      newErrors = { ...newErrors, attributes: 'Please select a primary attribute' }
    }
  }

  // validate variations
  if (!data.variations || data.variations.length === 0) {
    isValidInput = false
    newErrors = { ...newErrors, variations: 'Please enter a variation' }
  }

  /// check total number of variations
  let numberVariations
  for (const attribute of data.attributes) {
    if (attribute.options && attribute.options.length > 0) {
      numberVariations = numberVariations ? numberVariations * attribute?.options.length : attribute?.options.length
    }
  }
  if (data.variations.length < numberVariations) {
    isValidInput = false
    newErrors = { ...newErrors, variations: `Please enter enough ${numberVariations} variations` }
  }

  // TODO: validate for each attribute
  const attributeErrors = []
  if (data.attributes && data.attributes.length > 0) {
    const attributeNames = data.attributes.map((attribute) => attribute?.name)
    for (const attribute of data.attributes) {
      const errors = {}
      if (!attribute.name || attribute.name === '') {
        isValidInput = false
        errors.name = REQUIRED_FIELD_ERROR
      } else {
        if (isDuplicate(attribute.name, attributeNames)) {
          isValidInput = false
          errors.name = 'Attribute name is duplicated'
        }
      }
      if (!attribute.options || attribute.options.length === 0) {
        isValidInput = false
        errors.options = 'Required at least one option'
      } else {
        // TODO: check if attribute has default option
        let hasDefault = false
        attribute.options.map((option) => {
          if (option.isDefault) {
            hasDefault = true
          }
        })
        if (!hasDefault) {
          isValidInput = false
          errors.options = 'Please select an option as default for this attribute'
        }
      }
      attributeErrors.push(errors)
    }
    newErrors = { ...newErrors, attributeErrors: attributeErrors }
  }

  if (data.variations && data.variations.length > 0) {
    const variationErrors = []
    const variationSKUs = data.variations.map((variation) => variation?.sku)
    for (const variation of data.variations) {
      const errors = {}

      if (!(!variation || variation.sku === '') && isDuplicate(variation.sku, variationSKUs)) {
        isValidInput = false
        errors.sku = 'SKU is duplicated'
      }

      // TODO: check sale price
      if (!hasValue(variation.salePrice)) {
        isValidInput = false
        errors.salePrice = REQUIRED_FIELD_ERROR
      } else {
        if (!validatePrice(variation.salePrice)) {
          isValidInput = false
          errors.salePrice = 'Invalid input'
        }
      }

      // TODO: check regular price
      if (!hasValue(variation.regularPrice)) {
        isValidInput = false
        errors.regularPrice = REQUIRED_FIELD_ERROR
      } else {
        if (!validatePrice(variation.regularPrice)) {
          isValidInput = false
          errors.regularPrice = 'Invalid input'
        }
      }

      // TODO: check both sale price and regular price
      if (variation.salePrice && variation.regularPrice) {
        if (Number(variation.salePrice) > Number(variation.regularPrice)) {
          isValidInput = false
          errors.price = 'Sale price must be smaller than regular price'
        }
      }

      // TODO: validate for value of variation attribute
      if (variation.attributes && variation.attributes.length > 0) {
        const attributeErrors = []
        for (const attribute of variation.attributes) {
          const errors = {}
          if (!attribute.value) {
            isValidInput = false
            errors.value = REQUIRED_FIELD_ERROR
          }
          attributeErrors.push(errors)
        }
        errors.attributeErrors = attributeErrors
      }

      variationErrors.push(errors)
    }
    newErrors = { ...newErrors, variationErrors: variationErrors }
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

export const validateSalePrice = (data, errors, setErrors) => {
  let newErrors = { ...errors }
  if (!data.salePrice || data.salePrice === '') {
    newErrors = { ...newErrors, salePrice: { message: REQUIRED_FIELD_ERROR } }
  } else if (!validatePrice(data.salePrice)) {
    newErrors = { ...newErrors, salePrice: { message: 'Invalid input' } }
  } else {
    newErrors = { ...newErrors, salePrice: null }
  }

  if (data.salePrice && data.regularPrice) {
    newErrors =
      Number(data.salePrice) > Number(data.regularPrice)
        ? { ...newErrors, price: { message: 'Sale price must be smaller than regular price' } }
        : { ...newErrors, price: null }
  }
  setErrors(newErrors)
}

export const validateRegularPrice = (data, errors, setErrors) => {
  let newErrors = { ...errors }
  if (!data.regularPrice || data.regularPrice === '') {
    newErrors = { ...newErrors, regularPrice: { message: REQUIRED_FIELD_ERROR } }
  } else if (!validatePrice(data.regularPrice)) {
    newErrors = { ...newErrors, regularPrice: { message: 'Invalid input' } }
  } else {
    newErrors = { ...newErrors, regularPrice: null }
  }

  if (data.salePrice && data.regularPrice) {
    newErrors =
      Number(data.salePrice) > Number(data.regularPrice)
        ? { ...newErrors, price: { message: 'Sale price must be smaller than regular price' } }
        : { ...newErrors, price: null }
  }
  setErrors(newErrors)
}

export const isDuplicate = (value, poolData) => {
  let count = 0
  poolData.map((item) => {
    if (item === value) {
      count += 1
    }
  })
  return count > 1 ? true : false
}

export const hasValue = (value) => {
  if (!value || value === '') {
    return false
  }
  return true
}

export const textRequiredField = (name, value) => {
  if (!value || value === '') {
    return { [name]: REQUIRED_FIELD_ERROR }
  }
}

export const numberRequiredField = (name, value) => {
  if (!value || value === '') {
    return { [name]: REQUIRED_FIELD_ERROR }
  } else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
    return { [name]: 'Invalid input' }
  }
}

export const validateEmail = (name, value) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!value || value === '') {
    return { [name]: REQUIRED_FIELD_ERROR }
  } else if (!re.test(value)) {
    return { [name]: 'Invalid input' }
  }
}
export const validateConsumerKey = (value) => {
  const textRequired = textRequiredField('consumer_key', value)
  if (textRequired) {
    return textRequired
  }
  if (!value.startsWith('ck') || value.length !== 43) {
    return { consumer_key: 'Invalid input' }
  }
}

export const validateConsumerSecret = (value) => {
  const textRequired = textRequiredField('secret_key', value)
  if (textRequired) {
    return textRequired
  }
  if (!value.startsWith('cs') || value.length !== 43) {
    return { consumer_key: 'Invalid input' }
  }
}

export const validateDomainName = (value) => {
  const textRequired = textRequiredField('domain_name', value)
  if (textRequired) {
    return textRequired
  }
  const regex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
  if (!regex.exec(value)?.length > 0 || !regex.exec(value)) {
    return { domain_name: 'Invalid input' }
  }
}

export const arrayRequiredField = (name, value) => {
  if (!(Array.isArray(value) && value.length > 0)) {
    return { [name]: REQUIRED_FIELD_ERROR }
  }
}
