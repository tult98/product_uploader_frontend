import React, { useState } from 'react'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'

const TextAreaInput = ({ label, style, options = {}, value, dispatch, actionType }) => {
  const [textValue, setTextValue] = useState(value)

  const onChangeValue = (event) => {
    setTextValue(event.target.value)
    debounce(() => dispatch({ type: actionType, payload: textValue }), DEFAULT_DELAY)()
  }

  return (
    <div className={`${style} flex flex-col justify-start w-full`}>
      <label className="font-semibold uppercase">{label}</label>
      <textarea
        rows={options.rows}
        value={textValue}
        onChange={onChangeValue}
        className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
      />
    </div>
  )
}

export default TextAreaInput
