import React from 'react'
import LogsTableHeader from 'components/elements/LogCard/LogsTableHeader'
import ProductLogCard from './ProductLogCard'

const ProductLogsTable = ({ productLogs }) => {
  return (
    <div className="grid w-full grid-cols-12 bg-lightGray rounded-2xl shadow-grayShadow">
      <LogsTableHeader />
      {productLogs.map((productLog, index) => (
        <ProductLogCard key={productLog.sku} index={index} productLog={productLog} />
      ))}
    </div>
  )
}

export default ProductLogsTable
