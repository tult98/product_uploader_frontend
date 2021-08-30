import React, { useCallback, useState } from 'react'
import TextAreaInput from 'components/elements/Input/TextAreaInput'
import TextInput from 'components/elements/Input/TextInput'
import CategoriesInput from 'components/elements/Input/CategoriesInput'
import Attribute from 'components/elements/Attribute'
import VariationInput from 'components/widgets/VariationInput'
import { useTemplate } from 'hooks/useTemplate'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'

const TemplateInput = () => {
  const [numberOfVariations, setNumberOfVariations] = useState(0)
  const [numberOfAttributes, setNumberOfAttributes] = useState(0)
  const { state, dispatch } = useTemplate()

  const onCreateVariation = () => {
    setNumberOfVariations(numberOfVariations + 1)
    dispatch({ type: TEMPLATE_ACTIONS.ADD_VARIATION })
  }

  const onCreateAttribute = () => {
    setNumberOfAttributes(numberOfAttributes + 1)
    dispatch({ type: TEMPLATE_ACTIONS.ADD_ATTRIBUTE })
  }

  const renderVariations = useCallback(() => {
    const variations = []
    for (let i = 0; i < numberOfVariations; i++) {
      variations.push(
        <VariationInput
          key={i}
          index={i}
          name={`Variation ${i + 1}`}
          baseSKU={state.sku}
          variation={state.variations[i]}
          dispatch={dispatch}
        />,
      )
    }
    return variations
  }, [numberOfVariations, state.sku, state.attributes, state.variations])

  const renderAttributes = useCallback(() => {
    const attributes = []
    for (let i = 0; i < numberOfAttributes; i++) {
      attributes.push(
        <Attribute
          key={i}
          index={i}
          isMulti={true}
          attribute={state.attributes[i]}
          actionType={TEMPLATE_ACTIONS.SET_ATTRIBUTE}
          dispatch={dispatch}
        />,
      )
    }
    return attributes
  }, [numberOfAttributes])

  return (
    <div className="w-3/5 mb-44">
      <form className="flex flex-col items-center">
        <div className="my-10">Hoodie-Tshirt-Zip-Long Sleeve-Mask Hoodie</div>
        <TextInput
          label="SKU"
          type="text"
          style="mb-10"
          value={state.sku}
          dispatch={dispatch}
          actionType={TEMPLATE_ACTIONS.SET_SKU}
        />
        <TextInput
          label="name"
          type="text"
          style="mb-10"
          value={state.name}
          dispatch={dispatch}
          actionType={TEMPLATE_ACTIONS.SET_NAME}
        />
        <TextAreaInput
          label="description"
          type="text"
          options={{ rows: 6 }}
          style="mb-10"
          value={state.description}
          dispatch={dispatch}
          actionType={TEMPLATE_ACTIONS.SET_DESCRIPTION}
        />
        <CategoriesInput dispatch={dispatch} />
      </form>
      {renderAttributes(numberOfAttributes)}
      <button
        type="button"
        className="mt-10 text-blue-600 hover:text-blue-700 hover:underline"
        onClick={onCreateAttribute}
      >
        Add new attribute
      </button>
      {renderVariations(numberOfAttributes)}
      <div className="mt-10">
        <button type="button" className="text-blue-600 hover:text-blue-700 hover:underline" onClick={onCreateVariation}>
          Add new variation
        </button>
      </div>
      <div className="flex justify-center mt-20">
        <button type="button" className="px-12 py-4 bg-gray-400 rounded-full hover:bg-gray-500">
          Back
        </button>
        <button type="submit" className="px-12 py-4 ml-8 bg-yellow-400 rounded-full hover:bg-yellow-500">
          Create Template
        </button>
      </div>
    </div>
  )
}

export default TemplateInput
