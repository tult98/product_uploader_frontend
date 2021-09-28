import React, { useState } from 'react'

const ToolTip = ({ message }) => {
  const [isShow, setIsShow] = useState(false)

  const onShowToolTip = () => {
    setIsShow(true)
  }

  const onHideToolTip = () => {
    setIsShow(false)
  }

  return (
    <div className="relative flex flex-col items-center group">
      <svg
        className="w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        onMouseEnter={onShowToolTip}
        onMouseLeave={onHideToolTip}
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      {isShow && (
        <div className="absolute bottom-0 flex flex-col items-center mb-14 group-hover:flex w-96">
          <span className="relative z-10 px-6 py-4 text-xl leading-7 text-white whitespace-no-wrap bg-black shadow-lg">
            {message}
          </span>
          <div className="w-4 h-4 -mt-2 transform rotate-45 bg-black"></div>
        </div>
      )}
    </div>
  )
}

export default ToolTip
