import React from 'react'
import TemplateInput from 'components/screens/TemplateInput'
import NotFound404 from 'components/screens/NotFound404'
import { useTemplate } from 'hooks/useTemplate'
import { useAuthorization } from 'hooks/useAuthorization'

const CreateTemplatePage = () => {
  const { state, dispatch } = useTemplate()
  const hasPermission = useAuthorization({ adminRequired: true })

  return (
    <>
      <header>
        <title className="capitalize">Product Uploader | Create Template</title>
      </header>
      <div className="main-content">
        {!hasPermission ? (
          <NotFound404 />
        ) : (
          <div className="w-full mt-20 ">
            <TemplateInput state={state} dispatch={dispatch} />
          </div>
        )}
      </div>
    </>
  )
}

export default CreateTemplatePage
