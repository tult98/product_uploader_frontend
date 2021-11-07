import React from 'react'
import { useLocation } from 'react-router-dom'
import ProductLogsTable from 'components/widgets/ProductLogsTable'
import NoRecordFound from 'components/widgets/NoRecordFound'
import IntroducePage from 'components/widgets/IntroducePage'

const UploadProductLogsPage = () => {
  const location = useLocation()
  return (
    <>
      <header>
        <title>Product Uploader | Logs</title>
      </header>
      <div className="main-content">
        <div className="w-full mt-20">
          <IntroducePage
            name="product"
            title="Products upload logs"
            description="Where you got the result of uploading process."
          />
          <div>{location.state ? <ProductLogsTable productLogs={location.state} /> : <NoRecordFound />}</div>
        </div>
      </div>
    </>
  )
}

export default UploadProductLogsPage
