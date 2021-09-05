import React from 'react'
import TemplateInput from 'components/screens/TemplateInput'
import { useTemplate } from 'hooks/useTemplate'

const CreateTemplatePage = () => {
  const { state, dispatch } = useTemplate()

  return (
    <div className="main-content">
      <TemplateInput state={state} dispatch={dispatch} />
    </div>
  )
}

export default CreateTemplatePage
