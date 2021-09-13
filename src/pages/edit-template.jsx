import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import TemplateInput from 'components/screens/TemplateInput'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import Error from 'components/widgets/Error'
import { useTemplate } from 'hooks/useTemplate'
import TemplateServices from 'services/TemplateServices'
import { useEffect } from 'react/cjs/react.development'
import { formatToFormData, TEMPLATE_ACTIONS } from 'utils/templateUtils'

const EditTemplatePage = () => {
  const { state, dispatch } = useTemplate()

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
        <title className="capitalize">Product Uploader | Create Template</title>
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
    </>
  )
}

export default EditTemplatePage
