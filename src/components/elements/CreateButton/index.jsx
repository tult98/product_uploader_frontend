import React from 'react'
import Icon from '../Icon'

const CreateButton = ({ onClick }) => {
  return (
    <div className="flex justify-end w-full mb-4">
      <button
        type="button"
        className="flex flex-row items-center px-4 py-4 text-white bg-blue-600 rounded-full hover:bg-blue-500"
        onClick={onClick}
      >
        <Icon name="plus" style="w-8 h-8" fill="#ffffff" />
        Create new
      </button>
    </div>
  )
}

export default CreateButton
