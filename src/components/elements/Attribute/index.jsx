import React, { useContext, useState } from 'react'
import { useMutation } from 'react-query'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import ModalContext from 'context/ModalContext'
import TemplateAttributeServices from 'services/TemplateAttributeServices'

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
  const [isHidden, setIsHidden] = useState(false)

  const onDeleteAttribute = () => {
    setIsHidden(true)
  }

  const onChangeAttributeName = (event) => {
    dispatch({ type: actionType, payload: { index: index, data: { ...attribute, name: event.target.value } } })
  }

  const onSelectedAttributeOptions = (selectedOptions) => {
    attribute = isVariationAttribute
      ? { ...attribute, value: { code: selectedOptions.value, name: selectedOptions.label } }
      : {
          ...attribute,
          options: selectedOptions.map((option) => {
            return { code: option.value, name: option.label }
          }),
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
    <div className={`w-full my-10 ${isHidden ? 'hidden' : ''}`}>
      {isVariationAttribute ? (
        <>
          <label className="font-semibold uppercase">{attribute?.name || `Attribute name ${index + 1}`}</label>
          <Select
            value={{ value: attribute?.value?.code, label: attribute?.value?.name }}
            onChange={onSelectedAttributeOptions}
            options={attribute?.options?.map((option) => {
              return { value: option.code, label: option.name }
            })}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col justify-start w-full">
            <label className="font-semibold uppercase">{`Attribute name ${index + 1}`}</label>
            <input
              type="text"
              placeholder="Attribute name..."
              required
              value={attribute?.name || ''}
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              onChange={onChangeAttributeName}
            />
          </div>
          <div className="mt-10">
            <option className="font-semibold uppercase">{`Attribute value(s) ${index + 1}`}</option>
            <CreatableSelect
              isMulti={isMulti}
              value={
                attribute?.option?.map((option) => {
                  return { value: option.code, label: option.name }
                }) || []
              }
              options={attribute?.options?.map((option) => {
                return {
                  value: option.code,
                  label: option.name,
                }
              })}
              onCreateOption={onCreateAttributeOption}
              onChange={onSelectedAttributeOptions}
            />
          </div>
          <div className="mt-4">
            <input type="checkbox" />
            <span className="ml-4">Select as primary attribute</span>
          </div>
          <div className="flex justify-end mt-8">
            <button
              className="px-8 py-2 text-gray-200 bg-red-500 rounded-full hover:bg-red-400"
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
