import React, { useCallback, useState, useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import TextAreaInput from 'components/elements/Input/TextAreaInput'
import TextInput from 'components/elements/Input/TextInput'
import Attribute from 'components/elements/Attribute'
import VariationInput from 'components/widgets/VariationInput'
import CreateAttributeModal from 'components/elements/Attribute/CreateAttributeModal'
import CreateAttributeOptionModal from 'components/elements/Attribute/CreateAttributeOptionModal'
import DeleteAttributeModal from 'components/elements/Attribute/DeleteAttributeModal'
import TemplateServices from 'services/TemplateServices'
import ModalContext from 'context/ModalContext'
import { formatTemplateData, TEMPLATE_ACTIONS } from 'utils/templateUtils'
import { validateTemplateInput } from 'utils/errorsUtils'

const TemplateInput = ({ state, dispatch }) => {
  const [numberOfVariations, setNumberOfVariations] = useState(state.attributes.length)
  const [numberOfAttributes, setNumberOfAttributes] = useState(state.variations.length)
  const [errors, setErrors] = useState({})
  const { modalState } = useContext(ModalContext)

  const mutation = useMutation(TemplateServices.createTemplate)

  useEffect(() => {
    setNumberOfAttributes(state.attributes.length)
  }, [state?.attributes])

  const renderVariations = useCallback(() => {
    const variations = []
    for (let i = 0; i < numberOfVariations; i++) {
      variations.push(
        <VariationInput
          key={i}
          index={i}
          name={`Variation ${i + 1}`}
          variation={state.variations[i]}
          dispatch={dispatch}
        />,
      )
    }
    return variations
  }, [numberOfVariations, state.sku, state.attributes, state.variations])

  const renderAttributes = useCallback(() => {
    const attributes = []
    for (let i = 0; i < numberOfAttributes; i++) {
      attributes.push(
        <Attribute
          key={i}
          index={i}
          isMulti={true}
          attribute={state.attributes[i]}
          actionType={TEMPLATE_ACTIONS.SET_ATTRIBUTE}
          dispatch={dispatch}
        />,
      )
    }
    return attributes
  }, [numberOfAttributes])

  const onCreateVariation = () => {
    setNumberOfVariations(numberOfVariations + 1)
    dispatch({ type: TEMPLATE_ACTIONS.ADD_VARIATION })
  }

  const onCreateAttribute = () => {
    setNumberOfAttributes(numberOfAttributes + 1)
    dispatch({ type: TEMPLATE_ACTIONS.ADD_ATTRIBUTE })
  }

  const onCreateTemplate = () => {
    const isValidInput = validateTemplateInput(state, errors, setErrors)
    if (isValidInput) {
      // TODO: handle data before sending to backend
      const data = formatTemplateData(state)
      console.log('==========data:', data)
      // TODO: calling api
      // mutation.mutate(state)
    }
  }

  return (
    <>
      <div className={`w-2/5 mb-44 ${modalState.isModalOpen ? 'opacity-20' : ''}`}>
        <form className="flex flex-col justify-start">
          <div className="self-center my-20 text-5xl font-bold uppercase">Create a new template</div>
          <TextInput
            label="name"
            isRequired={true}
            type="text"
            style="mb-10"
            value={state.name}
            dispatch={dispatch}
            error={errors['name']}
            actionType={TEMPLATE_ACTIONS.SET_NAME}
          />

          <TextInput
            label="product title"
            isRequired={true}
            type="text"
            style="mb-10"
            value={state.productTitle}
            dispatch={dispatch}
            error={errors['product title']}
            actionType={TEMPLATE_ACTIONS.SET_PRODUCT_TITLE}
          />
          <TextAreaInput
            label="description"
            isRequired={true}
            type="text"
            options={{ rows: 6 }}
            style="mb-10"
            value={state.description}
            dispatch={dispatch}
            error={errors['description']}
            actionType={TEMPLATE_ACTIONS.SET_DESCRIPTION}
          />

          {renderAttributes(numberOfAttributes)}
          <button
            type="button"
            className="self-start mt-10 text-blue-600 hover:text-blue-700 hover:underline"
            onClick={onCreateAttribute}
          >
            Add new attribute
          </button>
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
              className="px-12 py-4 ml-8 bg-yellow-400 rounded-full hover:bg-yellow-500"
              onClick={onCreateTemplate}
            >
              Create Template
            </button>
          </div>
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
