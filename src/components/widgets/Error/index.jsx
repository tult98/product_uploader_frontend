import React from 'react'
import Icon from 'components/elements/Icon'

const Error = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center center-modal w-96 -translate-x-7/12 left-7/12">
      <Icon name="sadFace" style="w-16 h-16" fill="#ed3737" />
      <p className="w-full text-red-600">{error.errors?.message || 'Something went wrong, please re-try later'}</p>
    </div>
  )
}

export default Error
