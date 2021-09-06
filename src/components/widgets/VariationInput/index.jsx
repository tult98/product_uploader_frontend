import React, { useCallback, useEffect, useState } from 'react'
import Attribute from 'components/elements/Attribute'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'
import { validatePrice, validateVariationPrice } from 'utils/errorsUtils'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'

const VariationInput = ({ name, index, variation, dispatch }) => {
  const [errors, setErrors] = useState({})
  const [salePrice, setSalePrice] = useState(variation?.salePrice)
  const [regularPrice, setRegularPrice] = useState(variation?.regularPrice)

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

  const onChangeSalePrice = (event) => {
    setSalePrice(event.target.value)
    variation.salePrice = event.target.value
    debounce(() => {
      validateVariationPrice(variation, errors, setErrors)
      dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
    }, DEFAULT_DELAY)()
  }

  const onChangeRegularPrice = (event) => {
    setRegularPrice(event.target.value)
    variation.regularPrice = event.target.value
    debounce(() => {
      validateVariationPrice(variation, errors, setErrors)
      dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
    }, DEFAULT_DELAY)()
  }

  const onValidateSalePrice = () => {
    validatePrice(variation.salePrice)
      ? setErrors({ ...errors, salePrice: null })
      : setErrors({ ...errors, salePrice: { message: 'Invalid input' } })
  }

  const onValidateRegularPrice = () => {
    validatePrice(variation.regularPrice)
      ? setErrors({ ...errors, regularPrice: null })
      : setErrors({ ...errors, regularPrice: { message: 'Invalid input' } })
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
        <div className="flex flex-row items-center mb-10">
          <label className="font-semibold uppercase">SKU</label>
          <span className="px-8 py-2 ml-8 text-center uppercase bg-gray-200 border border-gray-400 rounded-lg min-h-30px min-w-80px">
            {variation.sku}
          </span>
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-5/12">
            <label className="font-semibold uppercase">Sale price</label>
            <input
              type="text"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              value={salePrice || ''}
              onChange={onChangeSalePrice}
              onBlur={onValidateSalePrice}
            />
          </div>

          <div className="flex flex-col w-5/12">
            <label className="font-semibold uppercase">Regular price</label>
            <input
              type="text"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              value={regularPrice || ''}
              onChange={onChangeRegularPrice}
              onBlur={onValidateRegularPrice}
            />
          </div>
        </div>
        {errors && errors.price && <p className="input-error">{errors.price.message}</p>}

        {renderAttributes(variation.attributes.length)}
      </div>
    </div>
  )
}

export default VariationInput
