import React, { useState } from 'react'
import { debounce } from 'utils/commonUtils'

const TextInput = ({ label, type = 'text', style, value, dispatch, actionType }) => {
  const [textValue, setTextValue] = useState(value)

  const onChangeValue = (event) => {
    setTextValue(event.target.value)
    debounce(() => dispatch({ type: actionType, payload: textValue }), 500)()
  }

  return (
    <div className={`${style} flex flex-col justify-start w-full`}>
      <label className="font-semibold uppercase">{label}</label>
      <input
        type={type}
        value={textValue}
        className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
        onChange={onChangeValue}
      />
    </div>
  )
}

export default TextInput
