import React from 'react'

const LogsTableHeader = () => {
  return (
    <div className="grid grid-cols-12 col-span-12 font-medium border-b border-gray-400">
      <div className="flex px-4 py-4 text-2xl text-gray-600 uppercase">index</div>
      <div className="flex col-span-1 px-4 py-4 text-2xl text-gray-600 uppercase">Status</div>
      <div className="flex col-span-4 px-4 py-4 text-2xl text-gray-600 uppercase">SKU</div>
      <div className="flex col-span-6 px-4 py-4 text-2xl text-gray-600 uppercase">Message</div>
    </div>
  )
}

export default LogsTableHeader
