import React from 'react'

const NotFound404 = () => {
  return (
    <div className="flex flex-row center-with-sidebar">
      <div className="flex flex-row">
        <p className="pr-6 text-6xl font-bold text-blue-600">404</p>
        <div className="w-px h-24 bg-gray-300"></div>
      </div>
      <div className="pl-6 leading-8">
        <p className="text-5xl font-bold">Page not found</p>
        <p className="text-gray-500">Please check the URL in the address bar and try again.</p>
        <div className="mt-10">
          <button type="button" className="px-8 py-4 text-white bg-blue-600 rounded-lg btn hover:bg-blue-400">
            Go back home
          </button>
          <button
            type="button"
            className="px-8 py-4 ml-2 text-blue-800 bg-blue-200 rounded-lg hover:bg-blue-400 hover:text-white"
          >
            Contact support
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound404
