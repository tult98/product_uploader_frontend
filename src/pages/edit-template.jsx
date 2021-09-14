import React, { useContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import TemplateInput from 'components/screens/TemplateInput'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import Error from 'components/widgets/Error'
import NotificationPopup from 'components/elements/NotificationPopup'
import { useTemplate } from 'hooks/useTemplate'
import TemplateServices from 'services/TemplateServices'
import NotificationContext from 'context/NotificationContext'
import { formatToFormData, TEMPLATE_ACTIONS } from 'utils/templateUtils'

const EditTemplatePage = () => {
  const { state, dispatch } = useTemplate()
  const { notificationState } = useContext(NotificationContext)

  const { templateId } = useParams()

  const { isLoading, isError, isSuccess, data, error, status } = useQuery(
    ['query-template', { id: templateId }],
    TemplateServices.queryTemplate,
  )

  useEffect(() => {
    if (isSuccess) {
      dispatch({ type: TEMPLATE_ACTIONS.SET_TEMPLATE, payload: formatToFormData(data) })
    }
  }, [status])

  return (
    <>
      <header>
        <title className="capitalize">Product Uploader | Edit Template</title>
      </header>

      <div className="main-content">
        {isLoading && (
          <div className="center-modal">
            <LoadingIndicator style="w-12 h-12" />
          </div>
        )}
        {isError && (
          <div className="center-modal">
            <Error error={error} />
          </div>
        )}
        {isSuccess && state.isFinish && <TemplateInput state={state} dispatch={dispatch} isEdit={true} />}
      </div>
      {notificationState.isShow && <NotificationPopup />}
    </>
  )
}

export default EditTemplatePage
