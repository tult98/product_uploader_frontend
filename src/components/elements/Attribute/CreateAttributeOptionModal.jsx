import React, { useEffect, useContext, useState } from 'react'
import Icon from 'components/elements/Icon'
import ModalContext from 'context/ModalContext'
import { REQUIRED_FIELD_ERROR } from 'utils/errorsUtils'

const CreateAttributeOptionModal = ({ attributes, actionType, dispatch }) => {
  const { modalState, setModalState } = useContext(ModalContext)
  const [optionName, setOptionName] = useState(modalState.initialValue || '')
  const [optionCode, setOptionCode] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (modalState.isEdit) {
      const attribute = attributes[modalState.attributeIndex]
      setOptionCode(attribute.options[modalState.attributeOptionIndex].code)
      setOptionName(attribute.options[modalState.attributeOptionIndex].name)
      setIsDefault(attribute.options[modalState.attributeOptionIndex].isDefault)
    }
  }, [])

  const onChangeOptionName = (event) => {
    setOptionName(event.target.value)
  }

  const onChangeOptionCode = (event) => {
    setOptionCode(event.target.value)
  }

  const onToggleDefault = () => {
    if (isDefault) {
      setIsDefault(false)
      setErrors({ ...errors, isDefault: null })
    } else {
      if (
        !attributes[modalState.attributeIndex].options ||
        attributes[modalState.attributeIndex].options.length === 0
      ) {
        setIsDefault(true)
      } else {
        attributes[modalState.attributeIndex].options.map((option) => {
          option.isDefault === true &&
            setErrors({ ...errors, isDefault: { message: 'You already set default option' } })
        })
      }
      if (!errors || !errors.isDefault) {
        setIsDefault(true)
      }
    }
  }

  const onCloseModal = () => {
    if (modalState.isEdit) {
      setModalState({
        ...modalState,
        openCreateOptionModal: false,
        isModalOpen: false,
        attributeIndex: null,
        isEdit: false,
        availableOptionIndex: null,
        attributeOptionIndex: null,
        availableOptions: null,
        setAvailableOptions: null,
        isCloseModal: true,
      })
    } else {
      setModalState({
        ...modalState,
        openCreateOptionModal: false,
        isModalOpen: false,
        initialValue: null,
        attributeIndex: null,
        availableOptions: null,
        setAvailableOptions: null,
        isCloseModal: true,
      })
    }
  }

  const onSubmit = () => {
    if (onValidateOptionCode() && onValidateOptionName()) {
      const attribute = attributes[modalState.attributeIndex]
      const newOption = {
        code: optionCode,
        name: optionName,
        isDefault: isDefault,
      }
      if (!modalState.isEdit) {
        attribute.options = attribute?.options || []
        dispatch({
          type: actionType,
          payload: {
            index: modalState.attributeIndex,
            data: {
              ...attribute,
              options: [...attribute?.options, { code: optionCode, name: optionName, isDefault: isDefault }],
            },
          },
        })
        modalState.setAvailableOptions([
          ...modalState.availableOptions,
          { code: optionCode, name: optionName, isDefault: isDefault },
        ])
      } else {
        // update availableOptions
        modalState.availableOptions[modalState.availableOptionIndex] = newOption
        modalState.setAvailableOptions([...modalState.availableOptions])
        // update options inside attribute
        attribute.options[modalState.attributeOptionIndex] = newOption
        dispatch({
          type: actionType,
          payload: {
            index: modalState.attributeIndex,
            data: {
              ...attribute,
              options: [...attribute?.options],
            },
          },
        })
      }
      onCloseModal()
    }
  }

  const onValidateOptionName = () => {
    if (!optionName || optionName === '') {
      setErrors({ ...errors, optionName: { message: REQUIRED_FIELD_ERROR } })
      return false
    } else {
      let isDuplicate = false
      const availableOptions = modalState.isEdit
        ? modalState.availableOptions.filter((_, index) => index !== modalState.availableOptionIndex)
        : modalState.availableOptions
      for (const option of availableOptions) {
        if (optionName === option.name && !isDuplicate) {
          isDuplicate = true
          break
        }
      }
      isDuplicate
        ? setErrors({ ...errors, optionName: { message: 'Option name is duplicated' } })
        : setErrors({ ...errors, optionName: null })
      return !isDuplicate
    }
  }

  const onValidateOptionCode = () => {
    if (!optionCode || optionCode === '') {
      setErrors({ ...errors, optionCode: { message: REQUIRED_FIELD_ERROR } })
      return false
    } else {
      let isDuplicate = false
      const availableOptions = modalState.isEdit
        ? modalState.availableOptions.filter((_, index) => index !== modalState.availableOptionIndex)
        : modalState.availableOptions
      for (const option of availableOptions) {
        if (optionCode === option.code && !isDuplicate) {
          isDuplicate = true
          break
        }
      }
      isDuplicate
        ? setErrors({ ...errors, optionCode: { message: 'Option code is duplicated' } })
        : setErrors({ ...errors, optionCode: null })
      return !isDuplicate
    }
  }

  return (
    <div className="bg-white border border-gray-400 center-modal">
      <div className="flex flex-row justify-between px-4 py-8 bg-gradient-to-r from-gray-500 to-gray-600">
        <p className="text-white ">{`${modalState.isEdit ? 'Edit' : 'Create'} a new option`}</p>
        <div onClick={onCloseModal} className="cursor-pointer">
          <Icon name="close" style="w-8 h-8 font-bold" fill="#fff" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-8 my-10">
        <div className="flex flex-col justify-start w-full">
          <label className="font-semibold uppercase">Option name</label>
          <input
            type="text"
            value={optionName}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeOptionName}
            onBlur={onValidateOptionName}
          />
          {errors && errors.optionName && <p className="input-error">{errors.optionName.message}</p>}
        </div>
        <div className="flex flex-col justify-start w-full mt-10">
          <label className="font-semibold uppercase">Option code</label>
          <input
            type="text"
            autoFocus={true}
            value={optionCode}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeOptionCode}
            onBlur={onValidateOptionCode}
          />
          {errors && errors.optionCode && <p className="input-error">{errors.optionCode.message}</p>}
        </div>
        <div className="flex flex-row items-center self-start mt-4">
          <input type="checkbox" checked={isDefault} onChange={onToggleDefault} />
          <label className="ml-2">Select as default option</label>
        </div>
        {errors && errors.isDefault && <p className="input-error">{errors.isDefault.message}</p>}
      </div>
      <div className="flex items-center py-4 justify-evenly">
        <button
          className="px-12 py-2 text-white bg-gray-600 rounded-full hover:bg-gray-300 hover:text-gray-800"
          onClick={onCloseModal}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={errors && (errors.isDefault || errors.optionName || errors.optionCode)}
          className="px-12 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-300 hover:text-gray-800"
          onClick={onSubmit}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default CreateAttributeOptionModal
