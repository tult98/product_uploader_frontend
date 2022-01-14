import ImagePreview from 'components/elements/ImagePreview'
import React, { useState } from 'react'
import Select, { components } from 'react-select'

const Option = (props) => {
  const [isShow, setIsShow] = useState(false)

  const onShowPreview = () => {
    setIsShow(true)
  }

  const onHidePreview = () => {
    setIsShow(false)
  }

  return (
    <div onMouseEnter={onShowPreview} onMouseLeave={onHidePreview}>
      <components.Option {...props} />
      <ImagePreview file={props.data} isShow={isShow} />
    </div>
  )
}

const MockVariation = ({ sku, groupedVariations, product, onChangeProducts }) => {
  const [selectedImage, setSelectedImage] = useState()

  const onSelectMockImage = (selectedImage) => {
    setSelectedImage(selectedImage)
    const groupedVariationIds = groupedVariations.map((groupedVariation) => groupedVariation.id)
    const newVariations = product.template.variations.map((templateVariation) => {
      if (groupedVariationIds.includes(templateVariation.id)) {
        return {
          ...templateVariation,
          image_name: `${product.sku}-${selectedImage.name.split('.')[0]}`,
          image_name_origin: selectedImage.name,
        }
      }
      return templateVariation
    })
    const newProduct = { ...product, template: { ...product.template, variations: newVariations } }
    onChangeProducts(newProduct)
  }

  return (
    <div className="mb-4">
      <p className="mb-2 font-medium">{sku}</p>
      <Select
        components={{ Option }}
        value={selectedImage}
        options={product.files}
        placeholder="Select image..."
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.name}
        onChange={onSelectMockImage}
      />
      {groupedVariations[0].errors && groupedVariations[0].errors.image_name && (
        <p className="input-error">{groupedVariations[0].errors.image_name}</p>
      )}
    </div>
  )
}

export default MockVariation
