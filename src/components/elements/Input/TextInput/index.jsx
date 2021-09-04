import React from 'react'

const TextInput = ({ label, type = 'text', style, value, dispatch, actionType }) => {
  const onChangeValue = (event) => {
    dispatch({ type: actionType, payload: event.target.value })
  }

  return (
    <div className={`${style} flex flex-col justify-start w-full`}>
      <label className="font-semibold uppercase">{label}</label>
      <input
        type={type}
        value={value}
        className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
        onChange={onChangeValue}
      />
    </div>
  )
}

export default TextInput
