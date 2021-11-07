import React, { useState, useMemo } from 'react'
import { useQuery } from 'react-query'
import Select from 'react-select'
import Icon from 'components/elements/Icon'
import CategoriesInput from 'components/elements/Input/CategoriesInput'
import ToolTip from 'components/elements/ToolTip'
import MockVariation from 'components/widgets/ProductInput/MockVariation'
import ImageItem from 'components/widgets/ProductInput/ImageItem'
import TemplateServices from 'services/TemplateServices'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { AlertError } from 'utils/AlertUtils'

const ProductInput = ({ product, onChangeProducts, store }) => {
  const [selectedTemplate, setSelectedTemplate] = useState()
  const { isLoading, isError, isSuccess, data } = useQuery(
    ['templates', { currentPage: 1, searchPattern: '' }],
    TemplateServices.queryTemplates,
    { keepPreviousData: true },
  )

  console.log('============', store)

  const onSelectTemplate = (selectedTemplate) => {
    setSelectedTemplate(selectedTemplate)

    onChangeProducts({ ...product, template: selectedTemplate })
  }

  const onDeleteProduct = () => {
    onChangeProducts({ sku: product.sku }, true)
  }

  const onSelectCategories = (selectedCategories) => {
    onChangeProducts({ ...product, categories: selectedCategories })
  }

  const onChangeProductName = (event) => {
    debounce(() => {
      onChangeProducts({ ...product, name: event.target.value })
    }, DEFAULT_DELAY)()
  }

  const groupVariationByPrimaryAttribute = useMemo(() => {
    if (!product.template) {
      return []
    }
    const groupedVariations = []
    const primaryAttribute = product.template.attributes.find((attribute) => !!attribute.is_primary)
    primaryAttribute.options.forEach((option) => {
      const variations = product.template.variations.filter((variation) => {
        const attribute = variation.attributes.find((attribute) => attribute.name === primaryAttribute.name)
        return option.name === attribute.value
      })
      groupedVariations.push({ sku: option.name, variations: variations })
    })
    return groupedVariations
  }, [product.template])

  if (isError) {
    AlertError('Cannot fetch templates')
  }

  return (
    <div className="relative flex flex-col p-8 mt-10 bg-white100 rounded-3xl shadow-grayShadow">
      <div className="absolute cursor-pointer right-4 top-4" onClick={onDeleteProduct}>
        <Icon name="close" style="w-8 h-8 " />
      </div>
      <div className="flex flex-col justify-center mb-10">
        <p className="mb-4 text-3xl font-medium uppercase">{product.sku}</p>
        <div className="flex justify-between w-full my-8">
          <div className="w-47.5%">
            <label className="font-medium capitalize">Template</label>
            <Select
              value={selectedTemplate}
              options={isSuccess && data.results}
              placeholder="Select template..."
              isLoading={isLoading}
              onChange={onSelectTemplate}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
            {product.errors && product.errors.template && <p className="input-error">{product.errors.template}</p>}
          </div>

          <div className="w-47.5%">
            <CategoriesInput
              store={store}
              style="w-full"
              labelStyle="font-medium capitalize"
              label="Category"
              onSelect={onSelectCategories}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex">
            <label className="mr-2 font-medium capitalize">Product name</label>
            <ToolTip message="Default name will be used if you do not enter a value" />
          </div>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            placeholder="Product name..."
            onChange={onChangeProductName}
          />
        </div>
      </div>
      <div className="overflow-y-auto max-h-72">
        {product.files.map((file, index) => (
          <ImageItem key={index} file={file} />
        ))}
      </div>
      {product && product.template && (
        <>
          <div className="mt-8 mb-4">
            <p className="text-3xl font-medium uppercase">Choose mockup images</p>
          </div>
          {groupVariationByPrimaryAttribute.map((groupedVariations) => (
            <MockVariation
              key={groupedVariations.sku}
              sku={groupedVariations.sku}
              groupedVariations={groupedVariations.variations}
              product={product}
              onChangeProducts={onChangeProducts}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default ProductInput
