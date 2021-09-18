import React from 'react'
import { useLocation } from 'react-router-dom'
import ProductLogsTable from 'components/widgets/ProductLogsTable'
import NoRecordFound from 'components/widgets/NoRecordFound'

const UploadProductLogsPage = () => {
  const location = useLocation()
  return (
    <>
      <header>
        <title>Product Uploader | Logs</title>
      </header>
      <div className="main-content">
        {location.state ? <ProductLogsTable productLogs={location.state} /> : <NoRecordFound />}
      </div>
    </>
  )
}

export default UploadProductLogsPage
