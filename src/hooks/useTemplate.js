import { useReducer } from 'react'
import { TEMPLATE_ACTIONS, DEFAULT_PRODUCT_TITLE } from 'utils/templateUtils'

const initialState = {
  name: '',
  productTitle: DEFAULT_PRODUCT_TITLE,
  description: '',
  attributes: [],
  variations: [
    {
      sku: null,
      isDefault: true,
      salePrice: null,
      regularPrice: null,
      attributes: [],
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
      return {
        ...state,
        attributes: [...attributesClone, { id: state.attributes.length > 0 ? state.attributes.pop(-1).id + 1 : 1 }],
        variations: state.variations.map((variation) => {
          return {
            ...variation,
            attributes: [...attributesClone, { id: state.attributes.length > 0 ? state.attributes.pop(-1).id + 1 : 1 }],
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
          return { ...variation, attributes: state.attributes }
        }),
      }
    }
    case TEMPLATE_ACTIONS.ADD_VARIATION:
      return {
        ...state,
        variations: [
          ...state.variations,
          {
            sku: null,
            isDefault: false,
            salePrice: null,
            regularPrice: null,
            attributes: state.attributes,
          },
        ],
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
    case TEMPLATE_ACTIONS.SET_TEMPLATE:
      return {
        ...action.payload,
        isFinish: true,
      }
    default:
      return state
  }
}

export const useTemplate = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
