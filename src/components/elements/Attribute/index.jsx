import React, { useContext, useState } from 'react'
// import { useMutation } from 'react-query'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import ModalContext from 'context/ModalContext'
// import TemplateAttributeServices from 'services/TemplateAttributeServices'
import { convertToAttributeFormat, convertToOptionFormat } from 'utils/templateUtils'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'

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

  const onChangeAttributeName = (event) => {
    setAttributeName(event.target.value)
    debounce(
      () => dispatch({ type: actionType, payload: { index: index, data: { ...attribute, name: event.target.value } } }),
      DEFAULT_DELAY,
    )()
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

  const onSetPrimaryAttribute = () => {
    setModalState({
      ...modalState,
      openCreateAttributeModal: true,
      isModalOpen: true,
      attributeIndex: index,
    })
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
          </div>
          <div className="mt-10">
            <option className="font-semibold uppercase">{`Attribute value(s) ${index + 1}`}</option>
            <CreatableSelect
              isMulti={isMulti}
              value={convertToOptionFormat(attribute?.options || [])}
              options={convertToOptionFormat(availableOptions)}
              onCreateOption={onCreateAttributeOption}
              onChange={onSelectedAttributeOptions}
            />
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
