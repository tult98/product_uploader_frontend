import React from 'react'
import TemplateInput from 'components/screens/TemplateInput'
import { useTemplate } from 'hooks/useTemplate'

const CreateTemplatePage = () => {
  const { state, dispatch } = useTemplate()
  return (
    <>
      <header>
        <title className="capitalize">Product Uploader | Create Template</title>
      </header>
      <div className="main-content">
        <TemplateInput state={state} dispatch={dispatch} />
      </div>
    </>
  )
}

export default CreateTemplatePage
