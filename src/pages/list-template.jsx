import React, { useContext, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import TemplateList from 'components/screens/TemplateList'
import DeleteTemplateModal from 'modals/DeleteTemplateModal'
import ModalContext from 'context/ModalContext'
import TemplateServices from 'services/TemplateServices'
import { useNotification } from 'hooks/useNotification'
import NotificationPopup from 'components/elements/NotificationPopup'

const ListTemplatePage = () => {
  const { modalState } = useContext(ModalContext)
  const { isShow, setIsShow, type, setType, message, setMessage, setAllowRedirect } = useNotification()
  const queryClient = useQueryClient()
  const mutation = useMutation(TemplateServices.deleteTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  useEffect(() => {
    if (mutation.isError) {
      setIsShow(true)
      setType('error')
      setMessage('Your template cannot be deleted at this moment')
    } else if (mutation.isSuccess) {
      setIsShow(true)
      setType('success')
      setMessage('Delete your template successfully')
    }
  }, [mutation.status])

  return (
    <>
      <header>
        <title>Product Uploader | Templates</title>
      </header>
      <div
        className={`main-content ${modalState.isModalOpen && modalState.openDeleteTemplateModal ? 'opacity-20' : ''}`}
      >
        <TemplateList />
      </div>
      {modalState.isModalOpen && modalState.openDeleteTemplateModal && <DeleteTemplateModal mutation={mutation} />}
      <NotificationPopup
        type={type}
        message={message}
        isShow={isShow}
        setIsShow={setIsShow}
        setAllowRedirect={setAllowRedirect}
      />
    </>
  )
}

export default ListTemplatePage
