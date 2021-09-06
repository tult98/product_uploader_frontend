import React, { useContext, useState } from 'react'
// import { useMutation } from 'react-query'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import ModalContext from 'context/ModalContext'
// import TemplateAttributeServices from 'services/TemplateAttributeServices'
import { convertToAttributeFormat, convertToOptionFormat } from 'utils/templateUtils'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { validateAttributeName, validateAttributeOptions } from 'utils/errorsUtils'
// import Icon from 'components/elements/Icon'

const Attribute = ({
  index = 0,
  isMulti = false,
  attribute,
  actionType,
  dispatch,
  isVariationAttribute = false,
  variationIndex,
}) => {
  const { modalState, setModalState } = useContext(ModalContext)
  const [availableOptions, setAvailableOptions] = useState([])
  const [attributeName, setAttributeName] = useState(attribute.name)
  const [errors, setErrors] = useState({})

  const onChangeAttributeName = (event) => {
    setAttributeName(event.target.value)
    debounce(() => {
      dispatch({ type: actionType, payload: { index: index, data: { ...attribute, name: event.target.value } } })
      validateAttributeName(event.target.value, errors, setErrors)
    }, DEFAULT_DELAY)()
  }

  const onDeleteAttribute = () => {
    setModalState({ ...modalState, openDeleteAttributeModal: true, attributeIndex: index, isModalOpen: true })
  }

  const onSelectedAttributeOptions = (selectedOptions) => {
    attribute = isVariationAttribute
      ? { ...attribute, value: { code: selectedOptions.value, name: selectedOptions.label } }
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
    validateAttributeOptions(selectedOptions, errors, setErrors)
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
    })
  }

  const onEditAttributeOption = (optionCode) => {
    let optionIndex
    let attributeIndex
    attribute.options.map((option, index) => {
      attributeIndex = option.code === optionCode ? index : null
    })
    availableOptions.map((option, index) => {
      optionIndex = option.code === optionCode ? index : null
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

  return (
    <div className="w-full my-10">
      {isVariationAttribute ? (
        <>
          <label className="font-semibold uppercase">
            {attribute?.name || `Attribute name ${index + 1}`}
            {attribute.isPrimary && <span className="text-red-500">{`  (*)`} </span>}
          </label>
          <Select
            value={{ value: attribute?.value?.code, label: attribute?.value?.name }}
            onChange={onSelectedAttributeOptions}
            options={convertToOptionFormat(attribute?.options || [])}
          />
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
            />
            {errors && errors.name && <p className="input-error">{errors?.name?.message}</p>}
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
            />
            {errors && errors.options && <p className="input-error">{errors.options.message}</p>}
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
