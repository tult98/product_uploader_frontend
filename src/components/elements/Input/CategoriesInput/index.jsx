import React from 'react'
import Select from 'react-select'
import { formatCategoriesData } from 'utils/categoryUtils'
import { TEMPLATE_ACTIONS } from 'utils/templateUtils'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
]

const CategoriesInput = ({ dispatch }) => {
  const onChangeOptions = (selectedOption) => {
    const categoriesData = formatCategoriesData(selectedOption)
    dispatch({ type: TEMPLATE_ACTIONS.SET_CATEGORIES, payload: categoriesData })
  }

  return (
    <div className="flex flex-col w-full">
      <label className="font-semibold uppercase">Categories</label>
      <Select closeMenuOnSelect={false} options={options} isMulti onChange={onChangeOptions} />
    </div>
  )
}

export default CategoriesInput
