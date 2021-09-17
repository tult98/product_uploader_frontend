import React from 'react'
import Icon from 'components/elements/Icon'
import { calculateAvailablePages, DEFAULT_LIMIT } from 'utils/commonUtils'

const Paginator = ({ count, currentPage, next, previous, setCurrentPage }) => {
  let totalPage
  if (Number(count) % DEFAULT_LIMIT !== 0) {
    totalPage = Math.floor(Number(count) / DEFAULT_LIMIT) + 1
  } else {
    totalPage = Math.floor(Number(count) / DEFAULT_LIMIT)
  }
  const availablePages = calculateAvailablePages(currentPage, totalPage)

  const onGoToFirstPage = () => {
    setCurrentPage(1)
  }

  const onGoToLastPage = () => {
    setCurrentPage(totalPage)
  }

  const onGoToNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const onGoToPreviousPage = () => {
    setCurrentPage(currentPage - 1)
  }

  return (
    <div className="flex flex-row items-center justify-center w-full mb-20">
      <button type="button" disabled={currentPage === 1} onClick={onGoToFirstPage}>
        <Icon
          name="doubleChevronLeft"
          style="w-12 h12 cursor-pointer"
          fill={`${currentPage === 1 ? '#b0b0b0' : '#404040'}`}
        />
      </button>
      <button type="button" disabled={currentPage === 1} onClick={onGoToPreviousPage}>
        <Icon name="chevronLeft" style="w-12 h12 cursor-pointer" fill={`${previous ? '#404040' : '#b0b0b0'}`} />
      </button>

      {availablePages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className="px-2 border-b-2 border-blue-500 border-opacity-0 cursor-pointer hover:border-opacity-100"
        >
          <p className={`${currentPage === page ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>{page}</p>
        </button>
      ))}
      <button type="button" disabled={currentPage === totalPage} onClick={onGoToNextPage}>
        <Icon name="chevronRight" style="w-12 h12 cursor-pointer" fill={`${next ? '#404040' : '#b0b0b0'}`} />
      </button>
      <button type="button" onClick={onGoToLastPage} disabled={currentPage === totalPage}>
        <Icon
          name="doubleChevronRight"
          style="w-12 h12 cursor-pointer"
          fill={`${currentPage === totalPage ? '#b0b0b0' : '#404040'}`}
        />
      </button>
    </div>
  )
}

export default Paginator
