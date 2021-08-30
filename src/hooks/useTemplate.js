import { useReducer } from 'react'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'

const initialState = {
  sku: '',
  name: '',
  description: '',
  categories: [],
  attributes: [],
  variations: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case TEMPLATE_ACTIONS.SET_SKU:
      return {
        ...state,
        sku: action.payload,
      }
    case TEMPLATE_ACTIONS.SET_NAME:
      return {
        ...state,
        name: action.payload,
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
    case TEMPLATE_ACTIONS.ADD_ATTRIBUTE:
      return {
        ...state,
        attributes: [...state.attributes, {}],
        variations: state.variations.map((variation) => {
          return { ...variation, attributes: [...state.attributes, {}] }
        }),
      }
    case TEMPLATE_ACTIONS.SET_ATTRIBUTE:
      state.attributes[action.payload.index] = action.payload.data
      return {
        ...state,
        attributes: state.attributes,
        variations: state.variations.map((variation) => {
          return { ...variation, attributes: state.attributes }
        }),
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
    case TEMPLATE_ACTIONS.SET_VARIATION_ATTRIBUTE:
      const newAttributes = state.variations[action.payload.variationIndex].attributes.map((attribute) => {
        return attribute.name === action.payload.data.name ? action.payload.data : attribute
      })
      state.variations[action.payload.variationIndex].attributes = newAttributes
      return {
        ...state,
        variations: state.variations,
      }
    default:
      return state
  }
}

export const useTemplate = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
