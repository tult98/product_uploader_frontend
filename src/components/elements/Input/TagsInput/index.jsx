import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { useQuery } from 'react-query'
import WooServices from 'services/WooServices'
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
      setInputValue(newInputValue.replaceAll('#', ''))
    }, DEFAULT_DELAY)()
  }

  const onCreateTag = (newTag) => {
    const tag = { label: newTag, isNewTag: true, value: availableTags.length + 1 }
    onSelect([...tags, tag])
    setAvailableTags([...availableTags, tag])
  }

  return (
    <div className={style}>
      <div className="flex">
        <label className={`${labelStyle} mr-2`}>{label}</label>
      </div>
      <CreatableSelect
        isDisabled={isDisabled}
        placeholder={isLoading ? 'Loading...' : 'Select tags...'}
        closeMenuOnSelect={false}
        options={isSuccess ? [...formatOptions(Object.values(data)), ...availableTags] : []}
        value={tags}
        isLoading={isLoading}
        isMulti
        onChange={onChangeOptions}
        onCreateOption={onCreateTag}
        onInputChange={onInputChange}
      />
      {!isLoading && isError && <p className="input-error">{error?.errors?.detail || UNKNOWN_ERROR_MESSAGE}</p>}
    </div>
  )
}

export default TagsInput
