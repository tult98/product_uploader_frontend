import React, { useContext } from 'react'
import TemplateInput from 'components/screens/TemplateInput'
import NotFound404 from 'components/screens/NotFound404'
import { useTemplate } from 'hooks/useTemplate'
import AuthenticationContext from 'context/AuthenticationContext'

const CreateTemplatePage = () => {
  const { state, dispatch } = useTemplate()
  const { user } = useContext(AuthenticationContext)

  return (
    <>
      <header>
        <title className="capitalize">Product Uploader | Create Template</title>
      </header>
      <div className="main-content">
        {!user.is_staff ? (
          <div className="fixed transform top-38 left-44">
            <NotFound404 />
          </div>
        ) : (
          <TemplateInput state={state} dispatch={dispatch} />
        )}
      </div>
    </>
  )
}

export default CreateTemplatePage
