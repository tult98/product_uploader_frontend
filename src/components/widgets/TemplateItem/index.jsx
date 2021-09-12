import React, { useContext } from 'react'
import Icon from 'components/elements/Icon'
import ModalContext from 'context/ModalContext'

const TemplateItem = ({ data }) => {
  const { modalState, setModalState } = useContext(ModalContext)

  const onDeleteTemplate = () => {
    setModalState({ ...modalState, openDeleteTemplateModal: true, isModalOpen: true, templateId: data.id })
  }

  return (
    <div className="w-2/3 p-8 mb-10 bg-white border-2 border-gray-500 rounded-lg">
      <p className="mb-8 font-medium">{data.name}</p>
      <div className="flex justify-end w-full button-section">
        <button
          type="button"
          className="flex flex-row px-8 py-4 mr-4 text-gray-200 bg-blue-500 rounded-full focus:outline-none hover:bg-blue-400"
        >
          <Icon name="detail" style="w-8 h-8 mr-2" fill="#ebedeb" />
          Details
        </button>
        <button
          type="button"
          className="flex flex-row px-8 py-4 text-gray-200 bg-red-500 rounded-full focus:outline-none hover:bg-red-400"
          onClick={onDeleteTemplate}
        >
          <Icon name="trash" style="w-8 -h8 mr-2" fill="#ebedeb" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default TemplateItem
