import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import ErrorIndicator from 'components/widgets/ErrorIndicator'
import TemplateInput from 'components/screens/TemplateInput'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import { useTemplate } from 'hooks/useTemplate'
import TemplateServices from 'services/TemplateServices'
import { formatToFormData, TEMPLATE_ACTIONS } from 'utils/templateUtils'
import NotFound404 from 'components/screens/NotFound404'
import { useAuthorization } from 'hooks/useAuthorization'

const EditTemplatePage = () => {
  const { state, dispatch } = useTemplate()
  const hasPermission = useAuthorization({ adminRequired: true })

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
        {!hasPermission ? (
          <div className="center-inside-main-content">
            <NotFound404 />
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="center-modal -translate-x-7/12 left-7/12">
                <LoadingIndicator style="w-16 h-16" />
              </div>
            )}
            {isError && <ErrorIndicator error={error} />}
            {isSuccess && state.isFinish && <TemplateInput state={state} dispatch={dispatch} isEdit={true} />}
          </>
        )}
      </div>
    </>
  )
}

export default EditTemplatePage
