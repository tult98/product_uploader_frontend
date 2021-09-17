import React, { useState } from 'react'
import { useQuery } from 'react-query'
import TemplateCard from 'components/widgets/TemplateCard'
import SearchBar from 'components/widgets/SearchBar'
import Error from 'components/widgets/Error'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import Paginator from 'components/widgets/Paginator'
import NoRecordFound from 'components/widgets/NoRecordFound'
import TemplateServices from 'services/TemplateServices'
import IntroducePage from 'components/widgets/IntroducePage'
import { formatToFormData } from 'utils/templateUtils'

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
    <div className="flex flex-col w-full mt-20 ">
      <IntroducePage
        name="template"
        title="Template Dashboard"
        description="This is where you control all your templates."
      />
      <SearchBar searchPattern={searchPattern} setSearchPattern={setSearchPattern} />
      {isLoading && (
        <div className="flex flex-col items-center center-modal -translate-x-7/12 left-7/12">
          <LoadingIndicator style="w-16 h-16" />
        </div>
      )}
      {isError && <Error error={error} />}
      {isSuccess ? (
        data.results.length > 0 ? (
          <>
            {data.results.map((template) => (
              <TemplateCard key={template.id} data={formatToFormData(template)} />
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

export default TemplateList
