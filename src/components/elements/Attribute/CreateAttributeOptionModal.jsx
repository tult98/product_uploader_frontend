import React, { useContext, useState } from 'react'
import Icon from 'components/elements/Icon'
import ModalContext from 'context/ModalContext'

const CreateAttributeOptionModal = ({ attributes, actionType, dispatch }) => {
  const { modalState, setModalState } = useContext(ModalContext)
  const [optionName, setOptionName] = useState(modalState.initialValue)
  const [optionCode, setOptionCode] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [errors, setErrors] = useState({})

  const onChangeOptionName = (event) => {
    setOptionName(event.target.value)
  }

  const onChangeOptionCode = (event) => {
    setOptionCode(event.target.value)
  }

  const onToggleDefault = () => {
    if (isDefault) {
      setIsDefault(false)
      setErrors({})
    } else {
      if (
        !attributes[modalState.attributeIndex].options ||
        attributes[modalState.attributeIndex].options.length === 0
      ) {
        setIsDefault(true)
      } else {
        attributes[modalState.attributeIndex].options.map((option) => {
          option.isDefault === true && setErrors({ isDefault: { message: 'You already set default option' } })
        })
      }
      if (!errors || !errors.isDefault) {
        setIsDefault(true)
      }
    }
  }

  const onCloseModal = () => {
    setModalState({
      ...modalState,
      openCreateOptionModal: false,
      isModalOpen: false,
      initialValue: null,
    })
  }

  const onSubmit = () => {
    const attribute = attributes[modalState.attributeIndex]
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
    onCloseModal()
  }

  return (
    <div className="bg-white border border-gray-400 center-modal">
      <div className="flex flex-row justify-between px-4 py-8 bg-gradient-to-r from-gray-500 to-gray-600">
        <p className="text-white ">Create a new option</p>
        <div onClick={onCloseModal} className="cursor-pointer">
          <Icon name="close" style="w-8 h-8 font-bold" fill="#fff" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-8 my-10">
        <div className="flex flex-col justify-start w-full">
          <label className="font-semibold uppercase">Option name</label>
          <input
            type="text"
            required
            value={optionName}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeOptionName}
          />
        </div>
        <div className="flex flex-col justify-start w-full mt-10">
          <label className="font-semibold uppercase">Option code</label>
          <input
            type="text"
            required
            value={optionCode}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeOptionCode}
          />
        </div>
        <div className="flex flex-row items-center self-start mt-4">
          <input type="checkbox" onClick={onToggleDefault} />
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
          disabled={errors && errors.isDefault}
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
