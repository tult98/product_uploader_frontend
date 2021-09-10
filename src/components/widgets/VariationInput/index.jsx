import React, { useCallback, useEffect, useState } from 'react'
import Attribute from 'components/elements/Attribute'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'
import { validateRegularPrice, validateSalePrice } from 'utils/errorsUtils'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { validateSKU } from 'utils/validators'
import Icon from 'components/elements/Icon'

const VariationInput = ({
  name,
  index,
  variation,
  variations,
  dispatch,
  variationErrors,
  templateErrors,
  setTemplateErrors,
  isDefaultVariation = false,
}) => {
  const [errors, setErrors] = useState({})
  const [salePrice, setSalePrice] = useState(variation?.salePrice)
  const [regularPrice, setRegularPrice] = useState(variation?.regularPrice)
  const [showToolTip, setShowToolTip] = useState(false)

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

  useEffect(() => {
    if (variation.sku && variation.sku !== '') {
      validateSKU(variation.sku, variations, errors, setErrors)
    }
  }, [variation.sku])

  const onChangeSalePrice = (event) => {
    setSalePrice(event.target.value)
    variation.salePrice = event.target.value
    debounce(() => {
      dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
    }, DEFAULT_DELAY)()
  }

  const onChangeRegularPrice = (event) => {
    setRegularPrice(event.target.value)
    variation.regularPrice = event.target.value
    debounce(() => {
      dispatch({ type: TEMPLATE_ACTIONS.SET_VARIATION, payload: { index: index, data: variation } })
    }, DEFAULT_DELAY)()
  }

  const onValidateSalePrice = () => {
    if (templateErrors.variationErrors) {
      templateErrors.variationErrors[index].salePrice = null
      setTemplateErrors({ ...templateErrors })
    }
    validateSalePrice(variation, errors, setErrors)
  }

  const onValidateRegularPrice = () => {
    if (templateErrors.variationErrors) {
      templateErrors.variationErrors[index].regularPrice = null
      setTemplateErrors({ ...templateErrors })
    }
    validateRegularPrice(variation, errors, setErrors)
  }

  const onShowToolTip = () => {
    setShowToolTip(true)
  }

  const onHideToolTip = () => {
    setShowToolTip(false)
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
          attributeErrors={variationErrors.attributeErrors?.length > i ? variationErrors.attributeErrors[i] : {}}
          templateErrors={templateErrors}
          setTemplateErrors={setTemplateErrors}
          isDefaultVariation={isDefaultVariation}
        />,
      )
    }
    return listAttributes
  }, [variation.attributes, variationErrors.attributeErrors])

  return (
    <div className="mt-20 mb-12 rounded-lg">
      <div className="flex flex-row">
        <div className="mb-4 font-semibold uppercase">{name}</div>
        {isDefaultVariation && (
          <div onMouseEnter={onShowToolTip} onMouseLeave={onHideToolTip}>
            <Icon style="w-8 h-8 ml-2 cursor-pointer" name="questionMark" fill="#e8544f" />
            {showToolTip && (
              <div className="absolute flex justify-center w-1/3 px-4 py-4 italic text-gray-600 bg-white border border-gray-500 rounded-lg">
                The default variation will be created by our system automatically based on the default value of your
                attributes.
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-8 border-2 border-gray-700">
        <div className="flex flex-col mb-10">
          <div className="flex flex-row items-center">
            <label className="font-semibold uppercase">SKU</label>
            <span className="px-8 py-2 ml-8 text-center uppercase bg-gray-200 border border-gray-400 rounded-lg min-h-30px min-w-80px">
              {variation.sku}
            </span>
          </div>

          {errors && errors.sku && <p className="input-error">{errors.sku}</p>}
          {!(errors && errors.sku) && variationErrors && variationErrors.sku && (
            <p className="input-error">{variationErrors.sku}</p>
          )}
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-5/12">
            <label className="font-semibold uppercase">Regular price</label>
            <input
              type="text"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              value={regularPrice || ''}
              onChange={onChangeRegularPrice}
              onBlur={onValidateRegularPrice}
            />
            {errors && errors.regularPrice && <p className="input-error">{errors?.regularPrice?.message}</p>}
            {!(errors && errors.regularPrice) && variationErrors && variationErrors.regularPrice && (
              <p className="input-error">{variationErrors.regularPrice}</p>
            )}
          </div>

          <div className="flex flex-col w-5/12">
            <label className="font-semibold uppercase">Sale price</label>
            <input
              type="text"
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              value={salePrice || ''}
              onChange={onChangeSalePrice}
              onBlur={onValidateSalePrice}
            />
            {errors && errors.salePrice && <p className="input-error">{errors?.salePrice?.message}</p>}
            {!(errors && errors.salePrice) && variationErrors && variationErrors.salePrice && (
              <p className="input-error">{variationErrors.salePrice}</p>
            )}
          </div>
        </div>
        {errors && errors.price && <p className="input-error">{errors.price.message}</p>}
        {!(errors && errors.price) && variationErrors && variationErrors.price && (
          <p className="input-error">{variationErrors.price}</p>
        )}
        {renderAttributes(variation.attributes.length)}
      </div>
    </div>
  )
}

export default VariationInput
