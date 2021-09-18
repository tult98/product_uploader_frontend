import React from 'react'

const LogsTableHeader = () => {
  return (
    <div className="grid grid-cols-12 col-span-12 border-b border-gray-400">
      <div className="flex justify-center py-4 text-2xl text-gray-600 uppercase">index</div>
      <div className="flex justify-center col-span-1 py-4 text-2xl text-gray-600 uppercase">Status</div>
      <div className="flex justify-center col-span-4 py-4 text-2xl text-gray-600 uppercase">SKU</div>
      <div className="flex justify-center col-span-6 py-4 text-2xl text-gray-600 uppercase">Message</div>
    </div>
  )
}

export default LogsTableHeader
