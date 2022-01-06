import { useReducer } from 'react'
import { TEMPLATE_ACTIONS, DEFAULT_PRODUCT_TITLE } from 'utils/templateUtils'

const initialState = {
  name: '',
  productTitle: DEFAULT_PRODUCT_TITLE,
  description: '',
  attributes: [],
  variations: [
    {
      id: 1,
      sku: null,
      isDefault: true,
      salePrice: null,
      regularPrice: null,
      attributes: [],
      stock_status: 'instock',
    },
  ],
}

const reducer = (state, action) => {
  switch (action.type) {
    case TEMPLATE_ACTIONS.SET_NAME:
      return {
        ...state,
        name: action.payload,
      }
    case TEMPLATE_ACTIONS.SET_PRODUCT_TITLE:
      return {
        ...state,
        productTitle: action.payload,
      }
    case TEMPLATE_ACTIONS.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      }
    case TEMPLATE_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      }
    case TEMPLATE_ACTIONS.ADD_ATTRIBUTE: {
      const attributesClone = [...state.attributes]
      const newAttributes = [
        ...state.attributes,
        { id: attributesClone.length > 0 ? attributesClone.pop(-1).id + 1 : 1 },
      ]
      return {
        ...state,
        attributes: newAttributes,
        variations: state.variations.map((variation) => {
          return {
            ...variation,
            attributes: [
              ...variation.attributes,
              { id: attributesClone.length > 0 ? attributesClone.pop(-1).id + 1 : 1 },
            ],
          }
        }),
      }
    }
    case TEMPLATE_ACTIONS.SET_ATTRIBUTE: {
      state.attributes[action.payload.index] = action.payload.data
      const defaultAttributes = []
      state.attributes.map((attribute) => {
        let defaultOption
        const options = attribute?.options || []
        for (const option of options) {
          if (option.isDefault) {
            defaultOption = option
            break
          }
        }
        // get attribute with default option as value
        const defaultAttribute = defaultOption
          ? {
              ...attribute,
              value: { code: defaultOption.code, name: defaultOption.name },
            }
          : { ...attribute }
        defaultAttributes.push(defaultAttribute)
      })
      state.variations[0].attributes = defaultAttributes
      return {
        ...state,
        attributes: state.attributes,
        variations: state.variations.map((variation, index) => {
          if (index === 0) {
            return variation
          }
          // get old variation attribute with new options
          const newAttributes = variation.attributes.map((attribute, index) => {
            return { ...attribute, options: state.attributes[index].options }
          })
          return { ...variation, attributes: newAttributes }
        }),
      }
    }
    case TEMPLATE_ACTIONS.ADD_VARIATION: {
      const variationsClone = [...state.variations]
      return {
        ...state,
        variations: [
          ...state.variations,
          {
            id: variationsClone.length > 0 ? variationsClone.pop(-1).id + 1 : 1,
            sku: null,
            isDefault: false,
            salePrice: null,
            regularPrice: null,
            attributes: state.attributes,
          },
        ],
      }
    }
    case TEMPLATE_ACTIONS.SET_VARIATION:
      state.variations[action.payload.index] = action.payload.data
      return {
        ...state,
        variations: state.variations,
      }
    case TEMPLATE_ACTIONS.SET_VARIATION_ATTRIBUTE: {
      const newAttributes = state.variations[action.payload.variationIndex].attributes.map((attribute) => {
        return attribute.name === action.payload.data.name ? action.payload.data : attribute
      })
      state.variations[action.payload.variationIndex].attributes = newAttributes
      return {
        ...state,
        variations: state.variations,
      }
    }
    case TEMPLATE_ACTIONS.DELETE_ATTRIBUTE: {
      const remainAttributes = state.attributes.filter((_, index) => {
        return index !== action.payload.index
      })
      return {
        ...state,
        attributes: remainAttributes,
        variations: state.variations.map((variation) => {
          return { ...variation, attributes: remainAttributes }
        }),
      }
    }
    case TEMPLATE_ACTIONS.SET_TEMPLATE: {
      const variations = action.payload.variations.map((variation) => {
        const newAttributes = variation.attributes.map((attribute, index) => {
          return { ...attribute, options: action.payload.attributes[index].options }
        })
        return { ...variation, attributes: newAttributes }
      })
      return {
        ...state,
        ...action.payload,
        variations: variations,
        isFinish: true,
      }
    }
    case TEMPLATE_ACTIONS.DELETE_VARIATION: {
      const remainVariations = state.variations.filter((variation) => {
        return variation.id !== action.payload.id
      })
      return {
        ...state,
        variations: remainVariations,
      }
    }
    default:
      return state
  }
}

export const useTemplate = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
