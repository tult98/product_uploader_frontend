import React, { useState, useContext, useEffect, useMemo } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import TextAreaInput from 'components/elements/Input/TextAreaInput'
import TextInput from 'components/elements/Input/TextInput'
import Attribute from 'components/elements/Attribute'
import VariationInput from 'components/widgets/VariationInput'
import CreateAttributeModal from 'components/elements/Attribute/CreateAttributeModal'
import CreateAttributeOptionModal from 'components/elements/Attribute/CreateAttributeOptionModal'
import DeleteAttributeModal from 'components/elements/Attribute/DeleteAttributeModal'
import DeleteVariationModal from 'modals/DeleteVariationModal'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import ModalContext from 'context/ModalContext'
import NotificationContext from 'context/NotificationContext'
import TemplateServices from 'services/TemplateServices'
import { TEMPLATE_ROUTES } from 'routes'
import { formatTemplateData, TEMPLATE_ACTIONS } from 'utils/templateUtils'
import { validateTemplateInput } from 'utils/errorsUtils'
import { validateRequired } from 'utils/validators'
import IntroducePage from 'components/widgets/IntroducePage'

const TemplateInput = ({ state, dispatch, isEdit = false }) => {
  const { modalState } = useContext(ModalContext)
  const { setNotificationState } = useContext(NotificationContext)
  const [errors, setErrors] = useState({})
  const history = useHistory()
  const queryClient = useQueryClient()

  const mutation = isEdit
    ? useMutation(TemplateServices.editTemplate, {
        onSuccess: () => {
          queryClient.invalidateQueries()
        },
      })
    : useMutation(TemplateServices.createTemplate)

  useEffect(() => {
    if (mutation.isSuccess) {
      setNotificationState({
        type: 'success',
        message: isEdit ? 'Template edit success' : 'Template creation success',
        isShow: true,
      })
      !isEdit && history.push(TEMPLATE_ROUTES.LIST_TEMPLATE)
    } else if (mutation.isError) {
      setNotificationState({
        type: 'error',
        message: isEdit ? 'Template edit failed' : 'Template creation failed',
        isShow: true,
      })
    }
  }, [mutation.status])

  const renderVariations = useMemo(() => {
    const variations = []
    for (let i = 1; i < state.variations.length; i++) {
      variations.push(
        <VariationInput
          key={state.variations[i]?.id}
          index={i}
          name={`Variation ${i}`}
          variations={state.variations}
          variation={state.variations[i]}
          dispatch={dispatch}
          variationErrors={errors.variationErrors?.length > i ? errors.variationErrors[i] : {}}
          templateErrors={errors}
          setTemplateErrors={setErrors}
        />,
      )
    }
    return variations
  }, [
    state.attributes,
    state.variations,
    [...state.variations.map((variation) => variation.attributes)],
    errors.variationErrors,
  ])

  const renderAttributes = useMemo(() => {
    const attributes = []
    for (let i = 0; i < state.attributes.length; i++) {
      attributes.push(
        <Attribute
          key={state.attributes[i]?.id}
          index={i}
          isMulti={true}
          attributes={state.attributes}
          attribute={state.attributes[i]}
          actionType={TEMPLATE_ACTIONS.SET_ATTRIBUTE}
          dispatch={dispatch}
          attributeErrors={errors?.attributeErrors?.length > i ? errors.attributeErrors[i] : {}}
          templateErrors={errors}
          setTemplateErrors={setErrors}
          customStyle="mt-8"
        />,
      )
    }
    return attributes
  }, [[...state.attributes.map((attribute) => attribute.options)], errors.attributeErrors])
  const onCreateVariation = () => {
    dispatch({ type: TEMPLATE_ACTIONS.ADD_VARIATION })
  }

  const onCreateAttribute = () => {
    dispatch({ type: TEMPLATE_ACTIONS.ADD_ATTRIBUTE })
  }

  const onCreateTemplate = () => {
    const isValidInput = validateTemplateInput(state, errors, setErrors)
    if (isValidInput) {
      setErrors({})
      const data = formatTemplateData(state)
      mutation.mutate(data)
    }
  }

  const onEditTemplate = () => {
    const isValidInput = validateTemplateInput(state, errors, setErrors)
    if (isValidInput) {
      setErrors({})
      const data = formatTemplateData(state)
      mutation.mutate({ id: state.id, data: data })
    }
  }

  const onValidateTemplateName = () => {
    setErrors({ ...errors, name: validateRequired(state.name) })
  }

  const onValidateProductTitle = () => {
    setErrors({ ...errors, productTitle: validateRequired(state.productTitle) })
  }

  const onValidateTemplateDescription = () => {
    setErrors({ ...errors, description: validateRequired(state.description) })
  }

  const onCancel = () => {
    history.push(TEMPLATE_ROUTES.LIST_TEMPLATE)
  }

  return (
    <>
      <div className={`w-full flex flex-col mb-44 mt-20 ${modalState.isModalOpen ? 'opacity-20' : ''}`}>
        <IntroducePage
          name="template"
          title={isEdit ? 'Edit a template' : 'Create a template'}
          description={
            isEdit
              ? 'Where you can edit your existing template'
              : 'Defining the best template for your future products.'
          }
        />
        <div className="flex justify-center w-full mt-20">
          <form className="flex flex-col items-center w-full">
            {/* <div className="self-center my-20 text-5xl font-bold uppercase">
              {isEdit ? 'Edit a template' : 'Create a new template'}
            </div> */}
            <div className="grid w-full grid-cols-2 gap-4">
              <TextInput
                label="name"
                isRequired={true}
                type="text"
                value={state.name}
                dispatch={dispatch}
                error={errors.name}
                actionType={TEMPLATE_ACTIONS.SET_NAME}
                onBlur={onValidateTemplateName}
              />

              <TextInput
                label="product title"
                isRequired={true}
                type="text"
                value={state.productTitle}
                dispatch={dispatch}
                error={errors.productTitle}
                actionType={TEMPLATE_ACTIONS.SET_PRODUCT_TITLE}
                onBlur={onValidateProductTitle}
              />
            </div>
            <TextAreaInput
              label="description"
              isRequired={true}
              type="text"
              options={{ rows: 6 }}
              style="mb-10"
              value={state.description}
              dispatch={dispatch}
              error={errors.description}
              actionType={TEMPLATE_ACTIONS.SET_DESCRIPTION}
              onBlur={onValidateTemplateDescription}
            />
            {renderAttributes}
            <button
              type="button"
              className="self-start mt-10 text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
              onClick={onCreateAttribute}
            >
              Add new attribute
            </button>
            <div className="self-start min-width-100">
              <VariationInput
                isDefaultVariation={true}
                key="default-variation"
                index={0}
                name="Default variation"
                variations={state.variations}
                variation={state.variations[0]}
                dispatch={dispatch}
                variationErrors={errors.variationErrors?.length > 0 ? errors.variationErrors[0] : {}}
                templateErrors={errors}
                setTemplateErrors={setErrors}
              />
              {renderVariations}
              <div className="mt-10">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
                  onClick={onCreateVariation}
                >
                  Add new variation
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <button type="button" className="secondary-btn" onClick={onCancel}>
                Back
              </button>
              <button
                type="button"
                className="flex items-center ml-8 primary-btn"
                onClick={!isEdit ? onCreateTemplate : onEditTemplate}
              >
                {mutation.isLoading && <LoadingIndicator style="w-8 h-8 mr-2" />}
                {isEdit ? 'Save' : 'Create'}
              </button>
            </div>
            {errors && (errors.attributes || errors.variations) && (
              <div className="mt-10 general-errors">
                {errors.attributes && <p className="input-error">*{errors.attributes}</p>}
                {errors.variations && <p className="input-error">*{errors.variations}</p>}
              </div>
            )}
            {/* TODO: handle error from server */}
            {mutation.isError && (
              <div className="mt-10">
                {mutation.error.code === 4000 && <p className="input-error">*{mutation.error.errors.message}</p>}
                {mutation.error.code === 400 ? (
                  mutation.error.errors.name ? (
                    <p className="input-error">*Template with this name already exits</p>
                  ) : (
                    <p className="input-error">*Input is invalid, please re-check your input before try again</p>
                  )
                ) : null}
              </div>
            )}
          </form>
        </div>
      </div>
      {modalState.openCreateAttributeModal && (
        <CreateAttributeModal
          attributes={state.attributes}
          actionType={TEMPLATE_ACTIONS.SET_ATTRIBUTE}
          dispatch={dispatch}
        />
      )}
      {modalState.openCreateOptionModal && (
        <CreateAttributeOptionModal
          attributes={state.attributes}
          actionType={TEMPLATE_ACTIONS.SET_ATTRIBUTE}
          dispatch={dispatch}
        />
      )}
      {modalState.openDeleteAttributeModal && (
        <DeleteAttributeModal
          attributes={state.attributes}
          actionType={TEMPLATE_ACTIONS.DELETE_ATTRIBUTE}
          dispatch={dispatch}
        />
      )}
      {modalState.openDeleteVariationModal && (
        <DeleteVariationModal
          attributes={state.attributes}
          actionType={TEMPLATE_ACTIONS.DELETE_VARIATION}
          dispatch={dispatch}
        />
      )}
    </>
  )
}

export default TemplateInput
