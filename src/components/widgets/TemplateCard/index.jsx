import React, { useContext, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import Icon from 'components/elements/Icon'
import ModalContext from 'context/ModalContext'
import { TEMPLATE_ROUTES } from 'routes'

const TemplateCard = ({ data }) => {
  const { modalState, setModalState } = useContext(ModalContext)

  const history = useHistory()

  const onDeleteTemplate = () => {
    setModalState({ ...modalState, openDeleteTemplateModal: true, isModalOpen: true, templateId: data.id })
  }

  const onDetailsTemplate = () => {
    history.push(`${TEMPLATE_ROUTES.LIST_TEMPLATE}${data.id}`)
  }

  const totalVariations = useMemo(() => {
    let total = 1
    data.attributes.forEach((attribute) => {
      total = total * attribute.options.length
    })
    return total
  }, [data.attributes])

  return (
    <div className="self-start w-full p-12 mb-10 rounded-3xl bg-white100 shadow-grayShadow">
      <div className="mb-10">
        <p className="mb-8 text-4xl font-semibold text-font1">{data.name}</p>
        <p>{data.productTitle}</p>
        <div className="flex justify-between w-full mt-10">
          <p className="font-medium text-lightPurple">Attributes</p>
          <p>{data.variations.length || 0}</p>
        </div>
        <div className="flex justify-between w-full mt-10">
          <p className="font-medium text-lightPurple">Variations</p>
          <p>{totalVariations}</p>
        </div>
      </div>
      <div className="flex justify-end w-full button-section">
        <button type="button" className="flex flex-row mr-4 primary-btn" onClick={onDetailsTemplate}>
          <Icon name="detail" style="w-8 h-8 mr-2" fill="#ebedeb" />
          Details
        </button>
        <button type="button" className="flex flex-row dangerous-btn" onClick={onDeleteTemplate}>
          <Icon name="trash" style="w-8 -h8 mr-2" fill="#ebedeb" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default TemplateCard
