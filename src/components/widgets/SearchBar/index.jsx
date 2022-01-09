import React, { useState } from 'react'
import Icon from 'components/elements/Icon'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'

const SearchBar = ({ searchPattern, setSearchPattern }) => {
  const [searchValue, setSearchValue] = useState(searchPattern)

  const onChangeValue = (event) => {
    setSearchValue(event.target.value)
    debounce(() => {
      setSearchPattern(event.target.value)
    }, DEFAULT_DELAY)()
  }

  return (
    <div className="flex justify-end w-full">
      <div className="relative flex items-center mb-8">
        <input
          type="text"
          value={searchValue}
          placeholder="Search..."
          className="py-3 pl-4 pr-12 border border-gray-500 rounded-full focus:outline-none"
          onChange={onChangeValue}
        />
        <Icon name="search" style="w-8 h-8 absolute right-4" fill="#807d7d" />
      </div>
    </div>
  )
}

export default SearchBar
