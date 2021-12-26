import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import SearchBar from 'components/widgets/SearchBar'
import ErrorIndicator from 'components/widgets/ErrorIndicator'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import Paginator from 'components/widgets/Paginator'
import TemplateServices from 'services/TemplateServices'
import IntroducePage from 'components/widgets/IntroducePage'
import { truncateLongText } from 'utils/commonUtils'
import ModalContext from 'context/ModalContext'
import { TEMPLATE_ROUTES } from 'routes'

const RECORD_PER_PAGE = 20

const TemplateList = () => {
  const history = useHistory()
  const [searchPattern, setSearchPattern] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { modalState, setModalState } = useContext(ModalContext)
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    ['templates', { currentPage, searchPattern, limit: RECORD_PER_PAGE }],
    TemplateServices.queryTemplates,
    { keepPreviousData: true },
  )

  useEffect(() => {
    if (currentPage !== 1) {
      window.history.replaceState(null, null, `?page=${currentPage}&search=${searchPattern}`)
    }
  }, [currentPage, searchPattern])

  const onDeleteTemplate = (templateId) => {
    setModalState({ ...modalState, openDeleteTemplateModal: true, isModalOpen: true, templateId })
  }

  const onDetailsTemplate = (templateId) => {
    history.push(`${TEMPLATE_ROUTES.LIST_TEMPLATE}${templateId}`)
  }

  return (
    <div className="flex flex-col w-full mt-20 ">
      <IntroducePage
        name="template"
        title="Template Dashboard"
        description="This is where you control all your templates."
      />
      <div className="flex flex-col justify-center w-full mt-10">
        {isLoading && <LoadingIndicator style="w-16 h-16 center-with-sidebar" />}
        {isError && <ErrorIndicator error={error} />}
        {isSuccess && (
          <>
            <SearchBar searchPattern={searchPattern} setSearchPattern={setSearchPattern} />
            <div className="w-full bg-lightGray">
              <div className="flex flex-row text-xl font-medium text-gray-600 uppercase">
                <div className="w-1/12 px-6 py-6">Index</div>
                <div className="w-1/4 px-6 py-6">Name</div>
                <div className="w-4/12 px-6 py-6">Product title</div>
                <div className="w-1/12 px-6 py-6">Attributes</div>
                <div className="w-1/12 px-6 py-6">Variations</div>
                <div className="w-1/6 px-6 py-6">Actions</div>
              </div>
            </div>
            <div className="w-full overflow-x-hidden bg-white max-h-500px">
              {data.results.length > 0 ? (
                data.results.map((template, index) => (
                  <div key={template.id} className="flex border-b border-gray-200">
                    <div className="w-1/12 px-6 py-6 ">{index + 1}</div>
                    <div className="w-1/4 px-6 py-6">{truncateLongText(template.name)}</div>
                    <div className="w-4/12 px-6 py-6 ">{truncateLongText(template.product_title)}</div>
                    <div className="w-1/12 px-6 py-6 ">{template.attributes.length || 0}</div>
                    <div className="w-1/12 px-6 py-6 ">{template.variations.length || 0}</div>
                    <div className="px-6 py-6 w-1/ ">
                      <button
                        type="button"
                        className="font-medium text-red-500 uppercase hover:underline hover:text-red-400"
                        onClick={() => onDeleteTemplate(template.id)}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="ml-6 font-medium text-blue-500 uppercase hover:underline hover:text-blue-400"
                        onClick={() => onDetailsTemplate(template.id)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-row items-center justify-center text-3xl text-red-500 h-400px">
                  <p className="text-red-600 ">No record found</p>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center justify-between w-full mt-10">
              <div className="text-2xl text-gray-700">
                <p>{`Showing ${data.results.length} of ${data.count} records.`}</p>
              </div>
              {!data.previous || !data.next || (data.next && data.previous) ? (
                <Paginator
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  count={data.count}
                  next={data.next}
                  previous={data.previous}
                  limit={RECORD_PER_PAGE}
                />
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TemplateList
