import React from 'react'
import CreatableSelect from 'react-select/creatable'

const attributeNameOptions = [
  { value: '1', label: 'Type' },
  { value: '2', label: 'Size' },
  { value: '3', label: 'Color' },
]

const attributeValueOptions = [
  { value: '1', label: 'S' },
  { value: '2', label: 'M' },
  { value: '3', label: 'L' },
  { value: '4', label: 'XL' },
  { value: '5', label: 'XXL' },
]

const Attribute = ({
  index = 0,
  isMulti = false,
  attribute,
  actionType,
  dispatch,
  isVariationAttribute = false,
  variationIndex,
}) => {
  const onSelectAttributeName = (selectedName) => {
    attribute = { ...attribute, name: selectedName }
    dispatch({
      type: actionType,
      payload: { index: index, data: attribute },
    })
  }

  const onSelectedAttributeOptions = (selectedOptions) => {
    attribute = isVariationAttribute
      ? { ...attribute, value: selectedOptions }
      : { ...attribute, options: selectedOptions }
    dispatch({
      type: actionType,
      payload: isVariationAttribute
        ? { index: index, variationIndex: variationIndex, data: attribute }
        : { index: index, data: attribute },
    })
  }

  return (
    <div className="my-10">
      {isVariationAttribute ? (
        <>
          <label className="font-semibold uppercase">{attribute?.name?.label || `Attribute name ${index + 1}`}</label>
          <Select value={attribute?.value || ''} onChange={onSelectedAttributeOptions} options={attribute.options} />
        </>
      ) : (
        <>
          <label className="font-semibold uppercase">{`Attribute name ${index + 1}`}</label>
          <CreatableSelect
            className="mb-10"
            value={attribute.name}
            options={attributeNameOptions}
            onChange={onSelectAttributeName}
          />
          <label className="font-semibold uppercase">{`Attribute value(s) ${index + 1}`}</label>
          <CreatableSelect
            isMulti={isMulti}
            closeMenuOnSelect={false}
            value={attribute.options}
            onChange={onSelectedAttributeOptions}
            options={attributeValueOptions}
          />
        </>
      )}
    </div>
  )
}

export default Attribute
