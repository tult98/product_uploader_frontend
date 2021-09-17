import React from 'react'
import Select from 'react-select'
import { useQuery } from 'react-query'
import WooServices from 'services/WooServices'
import { formatCategoriesData } from 'utils/categoryUtils'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'

const CategoriesInput = ({ dispatch }) => {
  const { isLoading, isError, data, error } = useQuery('fetching-categories', WooServices.queryCategories)
  let fetchedOptions = null

  if (!isLoading && !isError) {
    fetchedOptions = Object.values(data).map((category) => {
      return {
        value: category.id,
        label: category.name,
      }
    })
  }

  const onChangeOptions = (selectedOptions) => {
    const categoriesData = formatCategoriesData(selectedOptions)
    dispatch({ type: TEMPLATE_ACTIONS.SET_CATEGORIES, payload: categoriesData })
  }

  return (
    <div className="flex flex-col w-full">
      <label className="font-semibold uppercase">Categories</label>
      <Select
        placeholder={isLoading ? 'Loading...' : 'Select...'}
        closeMenuOnSelect={false}
        options={fetchedOptions || []}
        isMulti
        onChange={onChangeOptions}
        isLoading={isLoading}
      />
      {!isLoading && isError && <p className="input-error">{error.errors.message}</p>}
    </div>
  )
}

export default CategoriesInput
