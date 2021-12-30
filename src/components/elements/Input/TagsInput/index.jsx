import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { useQuery } from 'react-query'
import WooServices from 'services/WooServices'
// import ToolTip from 'components/elements/ToolTip'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { UNKNOWN_ERROR_MESSAGE } from 'utils/errorsUtils'

const formatOptions = (options) => {
  return options.map((option) => {
    return {
      value: option.id,
      label: option.name,
    }
  })
}

const TagsInput = ({
  onSelect,
  style,
  labelStyle,
  label,
  isDisabled,
  store,
  tags,
  setTags,
  availableTags,
  setAvailableTags,
}) => {
  const [inputValue, setInputValue] = useState('')
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['fetching-tags', { searchPattern: inputValue, store }],
    WooServices.queryTags,
    {
      enabled: !!store,
    },
  )

  const onChangeOptions = (selectedOptions) => {
    onSelect(selectedOptions)
  }

  const onInputChange = (newInputValue) => {
    debounce(() => {
      setInputValue(newInputValue)
    }, DEFAULT_DELAY)()
  }

  const onCreateTag = (newTag) => {
    const tag = { label: newTag, isNewTag: true }
    setTags([...tags, tag])
    setAvailableTags([...availableTags, tag])
  }

  return (
    <div className={style}>
      <div className="flex">
        <label className={`${labelStyle} mr-2`}>{label}</label>
        {/* <ToolTip message="Default category will be used if you do not enter a value" /> */}
      </div>
      <CreatableSelect
        isDisabled={isDisabled}
        placeholder={isLoading ? 'Loading...' : 'Select tags...'}
        closeMenuOnSelect={false}
        options={isSuccess ? [...formatOptions(Object.values(data)), ...availableTags] : []}
        value={tags}
        isLoading={isLoading}
        isMulti
        // getOptionLabel={(option) => option.name}
        // getOptionValue={(option) => option.id}
        onChange={onChangeOptions}
        onCreateOption={onCreateTag}
        onInputChange={onInputChange}
      />
      {!isLoading && isError && <p className="input-error">{error?.errors?.detail || UNKNOWN_ERROR_MESSAGE}</p>}
    </div>
  )
}

export default TagsInput
