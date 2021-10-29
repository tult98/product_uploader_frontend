import React, { useState } from 'react'
import { useQuery } from 'react-query'
import TemplateCard from 'components/widgets/TemplateCard'
import SearchBar from 'components/widgets/SearchBar'
import ErrorIndicator from 'components/widgets/ErrorIndicator'
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
      <div className="flex justify-center w-full">
        <div className="w-3/5">
          <SearchBar searchPattern={searchPattern} setSearchPattern={setSearchPattern} />
          {isLoading && <LoadingIndicator style="w-16 h-16 center-with-sidebar" />}
          {isError && <ErrorIndicator error={error} />}
          {isSuccess ? (
            data.results.length > 0 ? (
              <>
                {data.results.map((template) => (
                  <TemplateCard key={template.id} data={formatToFormData(template)} />
                ))}
                {data.next ||
                  (data.previous && (
                    <div className="w-full mt-20">
                      <Paginator
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        count={data.count}
                        next={data.next}
                        previous={data.previous}
                      />
                    </div>
                  ))}
              </>
            ) : (
              <NoRecordFound />
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default TemplateList
