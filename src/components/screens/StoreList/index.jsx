import React, { useState } from 'react'
import { useQuery } from 'react-query'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import ErrorIndicator from 'components/widgets/ErrorIndicator'
import NoRecordFound from 'components/widgets/NoRecordFound'
import Paginator from 'components/widgets/Paginator'
import StoreCard from 'components/widgets/StoreCard'
import StoreService from 'services/StoreService'

const StoreList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { isLoading, isError, isSuccess, error, data } = useQuery(
    ['query-stores', { currentPage }],
    StoreService.queryStores,
  )

  return (
    <div className="flex flex-col items-center w-full mt-20">
      {isLoading && (
        <div className="flex flex-col items-center center-model -translate-x-7/12 left-7/12">
          <LoadingIndicator style="w-16 h-16 " />
        </div>
      )}
      {isError && <ErrorIndicator error={error} />}
      {isSuccess ? (
        data.results.length > 0 ? (
          <>
            {data.results.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
            {data.next && (
              <Paginator
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                count={data.count}
                next={data.next}
                previous={data.previous}
              />
            )}
          </>
        ) : (
          <NoRecordFound />
        )
      ) : null}
    </div>
  )
}

export default StoreList
