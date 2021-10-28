import React from 'react'
import Icon from 'components/elements/Icon'
import { colors } from 'theme/variables/platform'
import { UNKNOWN_ERROR_MESSAGE } from 'utils/errorsUtils'

const ErrorIndicator = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center center-modal -translate-x-7/12 left-7/12">
      <Icon name="sadFace" style="w-16 h-16" fill={colors.lightRed} />
      <p className="w-full text-lightRed">{error.errors?.detail || UNKNOWN_ERROR_MESSAGE}</p>
    </div>
  )
}

export default ErrorIndicator
