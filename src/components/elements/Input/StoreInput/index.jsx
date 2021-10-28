import React, { useState } from 'react'
import Select from 'react-select'
import { useQuery } from 'react-query'
import ToolTip from 'components/elements/ToolTip'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import StoreService from 'services/StoreService'

const StoreInput = ({ onSelect, style, labelStyle, label, isDisabled }) => {
  const [inputValue, setInputValue] = useState('')
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['fetching-stores', { currentPage: 1, searchPattern: inputValue, limit: 10 }],
    StoreService.queryStores,
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
        <ToolTip message="Select the store you'd like to upload your products to" />
      </div>
      <Select
        isDisabled={isDisabled}
        placeholder={isLoading ? 'Loading...' : 'Select store...'}
        options={isSuccess ? data.results : []}
        isLoading={isLoading}
        getOptionLabel={(option) => option.domain_name}
        getOptionValue={(option) => option.id}
        onChange={onChangeOptions}
        onInputChange={onInputChange}
      />
      {!isLoading && isError && <p className="input-error">{error.errors.message}</p>}
    </div>
  )
}

export default StoreInput
