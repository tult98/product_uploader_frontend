import React from 'react'
import Icon from 'components/elements/Icon'

const NoRecordFound = () => {
  return (
    <div className="flex flex-col items-center center-modal -translate-x-7/12 left-7/12">
      <Icon name="sadFace" style="w-16 h-16" fill="#ed3737" />
      <p className="text-red-600 ">No record found</p>
    </div>
  )
}

export default NoRecordFound
