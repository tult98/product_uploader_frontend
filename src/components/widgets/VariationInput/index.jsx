import React, { useCallback, useEffect } from 'react'
import Attribute from 'components/elements/Attribute'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'

const VariationInput = ({ name, index, variation, dispatch }) => {
  useEffect(() => {
    let sku = ''
    variation.attributes.map(
      (attribute, index) =>
        (sku += attribute?.value?.code
          ? index === 0
            ? `${attribute?.value?.code}`
            : `-${attribute?.value?.code}`
          : ''),
    )
    variation.sku = sku
    dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
  }, [variation.attributes])

  const onToggleDefault = () => {
    variation.isDefault = !variation.isDefault
    dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
  }

  const onChangeSalePrice = (event) => {
    variation.salePrice = event.target.value
    dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
  }

  const onChangeRegularPrice = (event) => {
    variation.regularPrice = event.target.value
    dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
  }

  const renderAttributes = useCallback(() => {
    const listAttributes = []
    for (let i = 0; i < variation.attributes.length; i++) {
      listAttributes.push(
        <Attribute
          key={i}
          index={i}
          variationIndex={index}
          attribute={variation.attributes[i]}
          isVariationAttribute={true}
          actionType={TEMPLATE_ACTIONS.SET_VARIATION_ATTRIBUTE}
          dispatch={dispatch}
        />,
      )
    }
    return listAttributes
  }, [variation.attributes])

  return (
    <div className="mt-20 mb-12 rounded-lg">
      <div className="mb-4 font-semibold uppercase">{name}</div>
      <div className="p-8 border-2 border-gray-700">
        <div className="flex flex-row items-center justify-end">
          <input
            type="checkbox"
            name="default_variation"
            id="default_variation"
            value={variation.isDefault}
            onChange={onToggleDefault}
          />
          <label className="ml-2" htmlFor="default_variation">
            Set as default
          </label>
        </div>

        <div className="flex flex-row items-center mb-10">
          <label className="font-semibold uppercase">SKU</label>
          <span className="px-8 py-2 ml-8 text-center uppercase bg-gray-200 border border-gray-400 rounded-lg min-h-30px min-w-80px">
            {variation.sku}
          </span>
        </div>

        <div className="flex flex-row justify-between mb-10">
          <div className="flex flex-col w-5/12">
            <label className="font-semibold uppercase">Sale price</label>
            <input
              type="text"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              value={variation.salePrice || ''}
              onChange={onChangeSalePrice}
            />
          </div>

          <div className="flex flex-col w-5/12">
            <label className="font-semibold uppercase">Regular price</label>
            <input
              type="text"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              value={variation.regularPrice || ''}
              onChange={onChangeRegularPrice}
            />
          </div>
        </div>

        {renderAttributes(variation.attributes.length)}
      </div>
    </div>
  )
}

export default VariationInput
