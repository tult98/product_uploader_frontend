import React, { useState } from 'react'
import { colors } from 'theme/variables/platform'
import Icon from '../Icon'

const PasswordInput = ({ name, value, onChange, onBlur }) => {
  const [isShowPassword, setIsShowPassword] = useState(false)

  const onToggleShowPassword = () => {
    setIsShowPassword(!isShowPassword)
  }

  return (
    <div className="relative flex flex-row items-center">
      <input
        type={isShowPassword ? 'text' : 'password'}
        name={name}
        value={value}
        className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
        onBlur={onBlur}
        onChange={onChange}
      />
      <div className="absolute cursor-pointer right-4" onClick={onToggleShowPassword}>
        <Icon name={!isShowPassword ? 'eye' : 'eyeOff'} style="w-10 h-10" fill={colors.darkGray} />
      </div>
    </div>
  )
}

export default PasswordInput
