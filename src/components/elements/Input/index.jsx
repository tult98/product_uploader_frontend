import React from 'react'

const InputField = ({ label, type = 'text' }) => {
  return (
    <div className="input">
      <label>{label}</label>
      <input type={type} className="input__text" required />
    </div>
  )
}

export default InputField
