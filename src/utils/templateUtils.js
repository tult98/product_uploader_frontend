export const TEMPLATE_ACTIONS = {
  SET_PRODUCT_TITLE: 'SET_PRODUCT_TITLE',
  SET_NAME: 'SET_NAME',
  SET_DESCRIPTION: 'SET_DESCRIPTION',
  SET_CATEGORIES: 'SET_CATEGORIES',
  ADD_ATTRIBUTE: 'ADD_ATTRIBUTE',
  SET_ATTRIBUTE: 'SET_ATTRIBUTE',
  DELETE_ATTRIBUTE: 'DELETE_ATTRIBUTE',
  ADD_VARIATION: 'ADD_VARIATION',
  SET_VARIATION: 'SET_VARIATION',
  SET_VARIATION_ATTRIBUTE: 'SET_VARIATION_ATTRIBUTE',
  SET_TEMPLATE: 'SET_TEMPLATE',
}

export const DEFAULT_PRODUCT_TITLE = 'Limited Edition 3D All Over Printed Shirts For Men & Women'

export const convertToOptionFormat = (attributes) => {
  return attributes.map((attribute) => {
    return {
      value: attribute.code,
      label: `${attribute.name} - ${attribute.code}`,
    }
  })
}

export const convertToAttributeFormat = (options) => {
  return options.map((option) => {
    return {
      code: option.value,
      name: option.label.split(' - ')[0],
    }
  })
}

export const formatTemplateData = (data) => {
  // TODO: convert to valid data before send it to API
  const validTemplateData = {
    name: data.name,
    product_title: data.productTitle,
    description: `<span class="propery-title">[block id="${data.description}"]</span>`,
    attributes: data.attributes.map((attribute) => {
      return {
        name: attribute.name,
        is_primary: attribute.isPrimary,
        options: attribute.options.map((option) => {
          return {
            code: option.code,
            name: option.name,
            is_default: option.isDefault,
          }
        }),
      }
    }),
    variations: data.variations.map((variation, index) => {
      return {
        sku: variation.sku,
        is_default: variation.isDefault,
        sale_price: variation.salePrice,
        regular_price: variation.regularPrice,
        position: index + 1,
        attributes: variation.attributes.map((attribute) => {
          return {
            name: attribute.name,
            value: attribute.value.code,
          }
        }),
      }
    }),
  }

  return validTemplateData
}

export const formatToFormData = (data) => {
  // TODO: convert to valid form data before send it to API
  const formData = {
    id: data.id,
    name: data.name,
    productTitle: data.product_title,
    description: data.description.slice(39, -9),
    attributes: data.attributes.map((attribute) => {
      return {
        id: attribute.id,
        name: attribute.name,
        isPrimary: attribute.is_primary,
        options: attribute.options.map((option) => {
          return {
            code: option.code,
            name: option.name,
            isDefault: option.is_default,
          }
        }),
      }
    }),
    variations: data.variations.map((variation) => {
      return {
        sku: variation.sku,
        isDefault: variation.is_default,
        salePrice: variation.sale_price,
        regularPrice: variation.regular_price,
        attributes: variation.attributes.map((attribute) => {
          return {
            name: attribute.name.name,
            // TODO: get both code and name info from backend
            value: attribute.value,
          }
        }),
      }
    }),
  }

  return formData
}
