import React from 'react'
import LogsTableHeader from 'components/elements/LogCard/LogsTableHeader'
import ProductLogCard from './ProductLogCard'

const ProductLogsTable = ({ productLogs }) => {
  return (
    <div className="mt-20 w-full">
      <div className="grid w-full grid-cols-12 bg-lightGray shadow-grayShadow">
        <LogsTableHeader />
        {productLogs.map((productLog, index) => (
          <ProductLogCard key={productLog.sku} index={index} productLog={productLog} />
        ))}
      </div>
    </div>
  )
}

export default ProductLogsTable
