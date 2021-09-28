import React, { useCallback, useContext, useEffect, useState } from 'react'
import Attribute from 'components/elements/Attribute'
import Icon from 'components/elements/Icon'
import ToolTip from 'components/elements/ToolTip'
import ModalContext from 'context/ModalContext'
import { validateRegularPrice, validateSalePrice } from 'utils/errorsUtils'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { validateSKU } from 'utils/validators'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'
import { colors } from 'theme/variables/platform'

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

  const { modalState, setModalState } = useContext(ModalContext)

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

  const onDeleteVariation = () => {
    setModalState({ ...modalState, openDeleteVariationModal: true, variationId: variation.id, isModalOpen: true })
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
    <div className="my-8 rounded-lg">
      <div className="flex flex-row">
        <div className="mb-4 mr-1 font-semibold uppercase">{name}</div>
        {isDefaultVariation && (
          <ToolTip
            message="The default variation will be created by our system automatically based on the default value of your
                attributes."
          />
        )}
      </div>
      <div className="relative p-8 shadow-grayShadow bg-white100 rounded-3xl">
        {!isDefaultVariation && (
          <div className="cursor-pointer hover:opacity-80" onClick={onDeleteVariation}>
            <Icon name="close" style="w-8 h-8 absolute top-4 right-4" fill={colors.darkGray} />
          </div>
        )}

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
          <div className="flex flex-col w-5/12 ">
            <label className="font-semibold uppercase">Regular price</label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
                value={regularPrice || ''}
                onChange={onChangeRegularPrice}
                onBlur={onValidateRegularPrice}
              />
              <span className="absolute text-gray-600 bottom-3 right-4">$</span>
            </div>
            {errors && errors.regularPrice && <p className="input-error">{errors?.regularPrice?.message}</p>}
            {!(errors && errors.regularPrice) && variationErrors && variationErrors.regularPrice && (
              <p className="input-error">{variationErrors.regularPrice}</p>
            )}
          </div>

          <div className="flex flex-col w-5/12 ">
            <label className="font-semibold uppercase">Sale price</label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
                value={salePrice || ''}
                onChange={onChangeSalePrice}
                onBlur={onValidateSalePrice}
              />
              <span className="absolute text-gray-600 bottom-3 right-4">$</span>
            </div>

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
