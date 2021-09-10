import React, { useContext, useEffect, useState } from 'react'
// import { useMutation } from 'react-query'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import ModalContext from 'context/ModalContext'
// import TemplateAttributeServices from 'services/TemplateAttributeServices'
import { convertToAttributeFormat, convertToOptionFormat } from 'utils/templateUtils'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { REQUIRED_FIELD_ERROR } from 'utils/errorsUtils'
// import Icon from 'components/elements/Icon'

const Attribute = ({
  index = 0,
  isMulti = false,
  attributes,
  attribute,
  actionType,
  dispatch,
  isVariationAttribute = false,
  variationIndex,
  attributeErrors,
  templateErrors,
  setTemplateErrors,
  isDefaultVariation = false,
}) => {
  const { modalState, setModalState } = useContext(ModalContext)
  const [availableOptions, setAvailableOptions] = useState([])
  const [attributeName, setAttributeName] = useState(attribute?.name || '')
  const [errors, setErrors] = useState({})
  const [isCloseModal, setIsCloseModal] = useState(false)

  useEffect(() => {
    if (!modalState.openCreateOptionModal && isCloseModal) {
      onValidateAttributeOptions()
      setModalState({ ...modalState, isCloseModal: false })
    }
  }, [modalState.openCreateOptionModal])

  const onChangeAttributeName = (event) => {
    setAttributeName(event.target.value)
    debounce(() => {
      dispatch({ type: actionType, payload: { index: index, data: { ...attribute, name: event.target.value } } })
    }, DEFAULT_DELAY)()
  }

  const onDeleteAttribute = () => {
    setModalState({ ...modalState, openDeleteAttributeModal: true, attributeIndex: index, isModalOpen: true })
  }

  const onSelectedAttributeOptions = (selectedOptions) => {
    attribute = isVariationAttribute
      ? { ...attribute, value: convertToAttributeFormat([selectedOptions])[0] }
      : {
          ...attribute,
          options: convertToAttributeFormat(selectedOptions),
        }
    dispatch({
      type: actionType,
      payload: isVariationAttribute
        ? { index: index, variationIndex: variationIndex, data: attribute }
        : { index: index, data: attribute },
    })
    onValidateAttributeOptions()
  }

  const onCreateAttributeOption = (inputValue) => {
    setModalState({
      ...modalState,
      openCreateOptionModal: true,
      isModalOpen: true,
      initialValue: inputValue,
      attributeIndex: index,
      availableOptions: availableOptions,
      setAvailableOptions: setAvailableOptions,
      setIsCloseModal: setIsCloseModal,
    })
  }

  const onEditAttributeOption = (optionCode) => {
    let optionIndex
    let attributeIndex
    attribute.options.map((option, index) => {
      if (option.code === optionCode) {
        attributeIndex = index
      }
    })
    availableOptions.map((option, index) => {
      if (option.code === optionCode) {
        optionIndex = index
      }
    })
    setModalState({
      ...modalState,
      openCreateOptionModal: true,
      isModalOpen: true,
      attributeIndex: index,
      isEdit: true,
      availableOptionIndex: optionIndex,
      attributeOptionIndex: attributeIndex,
      availableOptions: availableOptions,
      setAvailableOptions: setAvailableOptions,
    })
  }

  const onSetPrimaryAttribute = () => {
    setModalState({
      ...modalState,
      openCreateAttributeModal: true,
      isModalOpen: true,
      attributeIndex: index,
    })
  }

  const formatOptionLabel = ({ label }, { context }) => {
    if (context === 'value') {
      return <div onClick={() => onEditAttributeOption(label.split(' - ')[1])}>{label}</div>
    } else if (context === 'menu') {
      return <div>{label}</div>
    }
  }

  const onValidateAttributeName = () => {
    if (templateErrors.attributeErrors) {
      templateErrors.attributeErrors[index].name = null
    }
    setTemplateErrors({ ...templateErrors })
    if (!attributeName || attributeName === '') {
      setErrors({ ...errors, name: { message: REQUIRED_FIELD_ERROR } })
    } else {
      let count = 0
      for (const attribute of attributes) {
        if (attribute.name === attributeName) {
          count += 1
        }
      }
      count > 1
        ? setErrors({ ...errors, name: { message: 'Attribute name is duplicated' } })
        : setErrors({ ...errors, name: null })
    }
  }

  const onValidateAttributeOptions = () => {
    if (templateErrors.attributeErrors) {
      templateErrors.attributeErrors[index].options = null
    }
    setTemplateErrors({ ...templateErrors })
    let newErrors = { ...errors }
    if (!attribute.options || attribute.options.length === 0) {
      newErrors = { ...newErrors, options: { message: 'Required at least one option' } }
    } else {
      newErrors = { ...newErrors, options: null }
    }
    setErrors(newErrors)
  }

  const onValidateAttributeValue = () => {
    if (templateErrors.variationErrors && templateErrors.variationErrors[variationIndex].attributeErrors) {
      templateErrors.variationErrors[variationIndex].attributeErrors[index].value = null
      setTemplateErrors({ ...templateErrors })
    }

    let newErrors = { ...errors }
    if (!attribute.value) {
      newErrors = { ...newErrors, value: REQUIRED_FIELD_ERROR }
    } else {
      newErrors = { ...newErrors, value: null }
    }
    setErrors(newErrors)
  }

  return (
    <div className="w-full my-10">
      {isVariationAttribute ? (
        <>
          <label className="font-semibold uppercase">
            {attribute?.name || `Attribute name ${index + 1}`}
            {attribute.isPrimary && <span className="text-red-500">{`  (*)`} </span>}
          </label>
          <Select
            value={{
              value: attribute?.value?.code,
              label: attribute?.value && `${attribute?.value?.name} - ${attribute?.value?.code}`,
            }}
            onChange={onSelectedAttributeOptions}
            options={convertToOptionFormat(attribute?.options || [])}
            onBlur={onValidateAttributeValue}
            isDisabled={isDefaultVariation}
          />

          {errors && errors.value && <p className="input-error">{errors.value}</p>}
          {!(errors && errors.value) && attributeErrors && attributeErrors.value && (
            <p className="input-error">{attributeErrors.value}</p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col justify-start w-full">
            <label className="font-semibold uppercase">
              {`Attribute name ${index + 1}  `}
              {attribute?.isPrimary && <span className="text-red-500">(*)</span>}
            </label>
            <input
              type="text"
              placeholder="Attribute name..."
              required
              value={attributeName || ''}
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              onChange={onChangeAttributeName}
              onBlur={onValidateAttributeName}
            />
            {errors && errors.name && <p className="input-error">{errors?.name?.message}</p>}
            {!(errors && errors.name) && attributeErrors && attributeErrors.name && (
              <p className="input-error">{attributeErrors.name}</p>
            )}
          </div>
          <div className="mt-10">
            <option className="font-semibold uppercase">{`Attribute value(s) ${index + 1}`}</option>
            <CreatableSelect
              isMulti={isMulti}
              value={convertToOptionFormat(attribute?.options || [])}
              options={convertToOptionFormat(availableOptions)}
              formatOptionLabel={formatOptionLabel}
              onCreateOption={onCreateAttributeOption}
              onChange={onSelectedAttributeOptions}
              onBlur={onValidateAttributeOptions}
            />
            {errors && errors.options && <p className="input-error">{errors.options.message}</p>}
            {!(errors && errors.options) && attributeErrors && attributeErrors.options && (
              <p className="input-error">{attributeErrors.options}</p>
            )}
          </div>
          <div className="flex justify-end mt-8">
            {!attribute?.isPrimary && (
              <button
                type="button"
                className="px-8 py-4 mr-4 text-gray-200 bg-blue-700 rounded-full hover:bg-blue-500"
                onClick={onSetPrimaryAttribute}
              >
                Set as primary
              </button>
            )}
            <button
              type="button"
              className="px-12 py-4 text-gray-200 bg-red-500 rounded-full hover:bg-red-400"
              onClick={onDeleteAttribute}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Attribute
