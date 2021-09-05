import React, { useContext, useEffect, useState } from 'react'
import Icon from 'components/elements/Icon'
import ModalContext from 'context/ModalContext'

const CreateAttributeModal = ({ attributes, actionType, dispatch }) => {
  const { modalState, setModalState } = useContext(ModalContext)
  const [isPrimaryAvailable, setIsPrimaryAvailable] = useState(true)

  useEffect(() => {
    attributes.map((attribute) => {
      attribute.isPrimary === true && setIsPrimaryAvailable(false)
    })
  }, [])

  const onCloseModal = () => {
    setModalState({ ...modalState, openCreateAttributeModal: false, isModalOpen: false, attributeIndex: null })
  }

  const onSetPrimaryAttribute = () => {
    if (!isPrimaryAvailable) {
      let primaryAttributeIndex
      attributes.forEach((attribute, index) => {
        if (attribute?.isPrimary === true) {
          primaryAttributeIndex = index
        }
      })
      dispatch({
        type: actionType,
        payload: { index: primaryAttributeIndex, data: { ...attributes[primaryAttributeIndex], isPrimary: false } },
      })
    }
    const attribute = attributes[modalState.attributeIndex]
    dispatch({
      type: actionType,
      payload: { index: modalState.attributeIndex, data: { ...attribute, isPrimary: true } },
    })
    onCloseModal()
  }

  return (
    <div className="bg-white border border-gray-400 center-modal">
      <div className="flex flex-row justify-between px-4 py-8 bg-gradient-to-r from-gray-500 to-gray-600">
        <p className="text-white ">Set default attribute?</p>
        <div onClick={onCloseModal} className="cursor-pointer">
          <Icon name="close" style="w-8 h-8 font-bold" fill="#fff" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 mt-10 mb-4">
        {isPrimaryAvailable ? (
          <>
            <p>Do you want to set this attribute as primary attribute?</p>
            <p className="text-xl italic text-gray-500">Do not worry, you can change it later!</p>
          </>
        ) : (
          <p className="input-error">You already set primary attribute, do you want to change?</p>
        )}
      </div>
      <div className="flex items-center justify-center py-4">
        <button
          className="px-12 py-2 text-white bg-gray-600 rounded-full hover:bg-gray-300 hover:text-gray-800"
          onClick={onCloseModal}
        >
          No
        </button>
        <button
          className="px-12 py-2 ml-8 text-white bg-blue-600 rounded-full hover:bg-blue-300 hover:text-gray-800"
          onClick={onSetPrimaryAttribute}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default CreateAttributeModal
