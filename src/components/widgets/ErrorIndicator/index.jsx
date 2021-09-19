import React from 'react'
import Icon from 'components/elements/Icon'
import { colors } from 'theme/variables/platform'

const ErrorIndicator = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center center-modal -translate-x-7/12 left-7/12">
      <Icon name="sadFace" style="w-16 h-16" fill={colors.lightRed} />
      <p className="w-full text-lightRed">{error.errors?.message || 'Something went wrong, please re-try later'}</p>
    </div>
  )
}

export default ErrorIndicator
