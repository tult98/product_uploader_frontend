import React, { useContext, useState, useEffect } from 'react'
import Icon from 'components/elements/Icon'
import ModalContext from 'context/ModalContext'
import { UNKNOWN_ERROR_MESSAGE } from 'utils/errorsUtils'

const DeleteTemplateModal = ({ mutation }) => {
  const { modalState, setModalState } = useContext(ModalContext)
  const [error, setError] = useState(null)

  const onCloseModal = () => {
    setModalState({ ...modalState, isModalOpen: null, openDeleteTemplateModal: true, templateId: null })
  }

  useEffect(() => {
    if (mutation.isError) {
      setError(mutation.error)
    } else if (mutation.isSuccess) {
      onCloseModal()
    }
  }, [mutation.status])

  const onDeleteTemplate = () => {
    mutation.mutate({ id: modalState.templateId })
  }

  return (
    <>
      <div className="bg-white border border-gray-400 center-content">
        <div className="flex flex-row justify-between px-4 py-8 bg-gradient-to-r from-gray-500 to-gray-600">
          <p className="text-white ">Confirm delete template?</p>
          <div className="cursor-pointer" onClick={onCloseModal}>
            <Icon name="close" style="w-8 h-8 font-bold" fill="#fff" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-4 mt-10 mb-4">
          <p>Do you want to delete this template?</p>
          <p className="text-xl italic text-red-500">This operation cannot be reverted!</p>
        </div>
        <div className="flex items-center justify-center py-4">
          <button
            type="button"
            className="px-12 py-2 text-white bg-gray-600 rounded-full hover:bg-gray-300 hover:text-gray-800"
            onClick={onCloseModal}
          >
            No
          </button>
          <button
            type="button"
            className="px-12 py-2 ml-8 text-white bg-blue-600 rounded-full hover:bg-blue-300 hover:text-gray-800"
            onClick={onDeleteTemplate}
          >
            OK
          </button>
        </div>
        {!!error && !!error.errors ? (
          <div className="pl-4">
            <p className="input-error text-xl">{error.errors.detail || UNKNOWN_ERROR_MESSAGE}</p>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default DeleteTemplateModal
