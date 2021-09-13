import React, { useCallback, useState, useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import TextAreaInput from 'components/elements/Input/TextAreaInput'
import TextInput from 'components/elements/Input/TextInput'
import Attribute from 'components/elements/Attribute'
import VariationInput from 'components/widgets/VariationInput'
import CreateAttributeModal from 'components/elements/Attribute/CreateAttributeModal'
import CreateAttributeOptionModal from 'components/elements/Attribute/CreateAttributeOptionModal'
import DeleteAttributeModal from 'components/elements/Attribute/DeleteAttributeModal'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import ModalContext from 'context/ModalContext'
import NotificationContext from 'context/NotificationContext'
import TemplateServices from 'services/TemplateServices'
import { TEMPLATE_ROUTES } from 'routes'
import { formatTemplateData, TEMPLATE_ACTIONS } from 'utils/templateUtils'
import { validateTemplateInput } from 'utils/errorsUtils'
import { validateRequired } from 'utils/validators'

const TemplateInput = ({ state, dispatch, isEdit = false }) => {
  const { modalState } = useContext(ModalContext)
  const { setNotificationState } = useContext(NotificationContext)
  const [numberOfVariations, setNumberOfVariations] = useState(state.variations.length)
  const [numberOfAttributes, setNumberOfAttributes] = useState(state.attributes.length)
  const [errors, setErrors] = useState({})
  const history = useHistory()

  const mutation = useMutation(TemplateServices.createTemplate)

  useEffect(() => {
    setNumberOfAttributes(state.attributes.length)
  }, [state?.attributes.length])

  useEffect(() => {
    if (mutation.isSuccess) {
      setNotificationState({
        type: 'success',
        message: 'Your template has been created successfully',
        isShow: true,
      })
      history.push(TEMPLATE_ROUTES.LIST_TEMPLATE)
    } else if (mutation.isError) {
      setNotificationState({
        type: 'success',
        message: 'Your template has been created successfully',
        isShow: true,
      })
    }
  }, [mutation.status])

  const renderVariations = useCallback(() => {
    const variations = []
    for (let i = 1; i < numberOfVariations; i++) {
      variations.push(
        <VariationInput
          key={i}
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
  }, [numberOfVariations, state.sku, state.attributes, state.variations, errors.variationErrors])

  const renderAttributes = useCallback(() => {
    const attributes = []
    for (let i = 0; i < numberOfAttributes; i++) {
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
        />,
      )
    }
    return attributes
  }, [numberOfAttributes, errors.attributeErrors])

  const onCreateVariation = () => {
    setNumberOfVariations(numberOfVariations + 1)
    dispatch({ type: TEMPLATE_ACTIONS.ADD_VARIATION })
  }

  const onCreateAttribute = () => {
    dispatch({ type: TEMPLATE_ACTIONS.ADD_ATTRIBUTE })
    setNumberOfAttributes(numberOfAttributes + 1)
  }

  const onCreateTemplate = () => {
    const isValidInput = validateTemplateInput(state, errors, setErrors)
    if (isValidInput) {
      setErrors({})
      const data = formatTemplateData(state)
      mutation.mutate(data)
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

  return (
    <>
      <div className={`w-2/5 mb-44 ${modalState.isModalOpen ? 'opacity-20' : ''}`}>
        <form className="flex flex-col justify-start">
          <div className="self-center my-20 text-5xl font-bold uppercase">
            {isEdit ? 'Edit a template' : 'Create a new template'}
          </div>
          <TextInput
            label="name"
            isRequired={true}
            type="text"
            style="mb-10"
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
            style="mb-10"
            value={state.productTitle}
            dispatch={dispatch}
            error={errors.productTitle}
            actionType={TEMPLATE_ACTIONS.SET_PRODUCT_TITLE}
            onBlur={onValidateProductTitle}
          />
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

          {renderAttributes(numberOfAttributes)}
          <button
            type="button"
            className="self-start mt-10 text-blue-600 hover:text-blue-700 hover:underline"
            onClick={onCreateAttribute}
          >
            Add new attribute
          </button>
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
          {renderVariations(numberOfAttributes)}
          <div className="mt-10">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 hover:underline"
              onClick={onCreateVariation}
            >
              Add new variation
            </button>
          </div>
          <div className="flex justify-center mt-20">
            <button type="button" className="px-12 py-4 bg-gray-400 rounded-full hover:bg-gray-500">
              Back
            </button>
            <button
              type="button"
              className="flex items-center px-12 py-4 ml-8 bg-yellow-400 rounded-full hover:bg-yellow-500"
              onClick={onCreateTemplate}
            >
              {mutation.isLoading && <LoadingIndicator style="w-8 h-8 mr-2" />}
              {isEdit ? 'Edit Template' : 'Create Template'}
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
    </>
  )
}

export default TemplateInput
