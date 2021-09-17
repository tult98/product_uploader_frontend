import React, { useContext, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import TemplateList from 'components/screens/TemplateList'
import DeleteTemplateModal from 'modals/DeleteTemplateModal'
import ModalContext from 'context/ModalContext'
import NotificationContext from 'context/NotificationContext'
import TemplateServices from 'services/TemplateServices'

const ListTemplatePage = () => {
  const { modalState } = useContext(ModalContext)
  const { setNotificationState } = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const mutation = useMutation(TemplateServices.deleteTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  useEffect(() => {
    if (mutation.isError) {
      setNotificationState({
        type: 'error',
        message: 'Your template cannot be deleted at this moment',
        isShow: true,
      })
    } else if (mutation.isSuccess) {
      setNotificationState({
        type: 'success',
        message: 'Delete your template successfully',
        isShow: true,
      })
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
    </>
  )
}

export default ListTemplatePage
