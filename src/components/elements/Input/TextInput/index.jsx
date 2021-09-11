import React, { useState } from 'react'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'

const TextInput = ({ label, type = 'text', style, value, dispatch, actionType, isRequired = false, error, onBlur }) => {
  const [textValue, setTextValue] = useState(value)

  const onChangeValue = (event) => {
    setTextValue(event.target.value)
    debounce(() => dispatch({ type: actionType, payload: event.target.value }), DEFAULT_DELAY)()
  }

  return (
    <div className={`${style} flex flex-col justify-start w-full`}>
      <label className="font-semibold uppercase">{label}</label>
      <input
        type={type}
        required={isRequired}
        value={textValue}
        className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
        onChange={onChangeValue}
        onBlur={onBlur}
      />
      <p className="input-error">{error}</p>
    </div>
  )
}

export default TextInput
