import React from 'react'
import Icon from 'components/elements/Icon'

const Error = ({ error }) => {
  return (
    <div className="flex flex-col items-center center-modal">
      <Icon name="sadFace" style="w-16 h-16" fill="#ed3737" />
      <p className="text-red-600 ">{error.errors.message}</p>
    </div>
  )
}

export default Error
