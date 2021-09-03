import React from 'react'

const TextAreaInput = ({ label, style, options = {}, value, dispatch, actionType }) => {
  const onChangeValue = (event) => {
    dispatch({ type: actionType, payload: event.target.value })
  }

  return (
    <div className={`${style} flex flex-col justify-start w-full`}>
      <label className="font-semibold uppercase">{label}</label>
      <textarea
        rows={options.rows}
        required
        value={value}
        onChange={onChangeValue}
        className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
      />
    </div>
  )
}

export default TextAreaInput
