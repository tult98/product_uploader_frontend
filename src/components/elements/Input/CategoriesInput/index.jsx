import React, { useState } from 'react'
import Select from 'react-select'
import { useQuery } from 'react-query'
import WooServices from 'services/WooServices'
import ToolTip from 'components/elements/ToolTip'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'

const CategoriesInput = ({ onSelect, style, labelStyle, label, isDisabled }) => {
  const [inputValue, setInputValue] = useState('')
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['fetching-categories', { searchPattern: inputValue }],
    WooServices.queryCategories,
  )

  const onChangeOptions = (selectedOptions) => {
    onSelect(selectedOptions)
  }

  const onInputChange = (newInputValue) => {
    debounce(() => {
      setInputValue(newInputValue)
    }, DEFAULT_DELAY)()
  }

  return (
    <div className={style}>
      <div className="flex">
        <label className={`${labelStyle} mr-2`}>{label}</label>
        <ToolTip message="Default category will be used if you do not enter a value" />
      </div>
      <Select
        isDisabled={isDisabled}
        placeholder={isLoading ? 'Loading...' : 'Select category...'}
        closeMenuOnSelect={false}
        options={isSuccess ? Object.values(data) : []}
        isLoading={isLoading}
        isMulti
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        onChange={onChangeOptions}
        onInputChange={onInputChange}
      />
      {!isLoading && isError && <p className="input-error">{error.errors.detail}</p>}
    </div>
  )
}

export default CategoriesInput
