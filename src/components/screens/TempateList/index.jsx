import React, { useState } from 'react'
import { useQuery } from 'react-query'
import TemplateItem from 'components/widgets/TemplateItem'
import SearchBar from 'components/widgets/SearchBar'
import Error from 'components/widgets/Error'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import TemplateServices from 'services/TemplateServices'
import Paginator from 'components/widgets/Paginator'

const TemplateList = () => {
  const [searchPattern, setSearchPattern] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  // TODO: fetch list of template
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['templates', { currentPage, searchPattern }],
    TemplateServices.queryTemplates,
    { keepPreviousData: true },
  )

  return (
    <div className="flex flex-col items-center justify-center w-3/5 mt-20 ">
      <SearchBar searchPattern={searchPattern} setSearchPattern={setSearchPattern} />
      {isLoading && (
        <div className="flex flex-col items-center center-modal">
          <LoadingIndicator style="w-16 h-16" />
          <p className="text-gray-700">Loading templates...</p>
        </div>
      )}
      {isError && <Error error={error} />}
      {isSuccess && (
        <>
          {data.results.map((template) => (
            <TemplateItem key={template.id} data={template} />
          ))}
          <Paginator
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            count={data.count}
            next={data.next}
            previous={data.previous}
          />
        </>
      )}
    </div>
  )
}

export default TemplateList
