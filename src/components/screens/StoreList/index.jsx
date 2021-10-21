import React, { useState, useContext, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import ErrorIndicator from 'components/widgets/ErrorIndicator'
import NoRecordFound from 'components/widgets/NoRecordFound'
import Paginator from 'components/widgets/Paginator'
import SearchBar from 'components/widgets/SearchBar'
import DeleteStoreModal from 'modals/DeleteStoreModal'
import ModalContext from 'context/ModalContext'
import NotificationContext from 'context/NotificationContext'
import StoreService from 'services/StoreService'
import { truncateLongText } from 'utils/commonUtils'

const getAssignedUsers = (users) => {
  const assignedUsers = users.reduce((assignedUser, user, index) => {
    return index === users.length - 1 ? assignedUser + user.username : assignedUsers + user.user.username + ', '
  }, '')
  return truncateLongText(assignedUsers)
}

const StoreList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchPattern, setSearchPattern] = useState('')
  const { modalState, setModalState } = useContext(ModalContext)
  const { setNotificationState } = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const { isLoading, isError, isSuccess, error, data } = useQuery(
    ['query-stores', { currentPage, searchPattern, limit: 10 }],
    StoreService.queryStores,
    { keepPreviousData: true },
  )

  const mutation = useMutation(StoreService.deleteStore, {
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  useEffect(() => {
    if (mutation.isSuccess) {
      setNotificationState({
        type: 'success',
        message: 'Store was delete successful.',
        isShow: true,
      })
    } else if (mutation.isError) {
      setNotificationState({
        type: 'error',
        message: 'Failed at delete store.',
        isShow: true,
      })
    }
  }, [mutation.status])

  const onDeleteStore = (storeId) => {
    setModalState({ ...modalState, isModalOpen: true, openDeleteStoreModal: true, storeId: storeId })
  }

  return (
    <>
      <div className={`flex flex-col items-center w-full mt-20 ${modalState.isModalOpen ? 'opacity-20' : ''}`}>
        {isLoading && (
          <div className="flex flex-col items-center center-model -translate-x-7/12 left-7/12">
            <LoadingIndicator style="w-16 h-16 " />
          </div>
        )}
        {isError && <ErrorIndicator error={error} />}
        {isSuccess ? (
          <>
            <SearchBar searchPattern={searchPattern} setSearchPattern={setSearchPattern} />
            <div className="w-full table-fixed shadow-grayShadow">
              <div className="bg-lightGray">
                <div className="flex flex-row text-xl font-medium text-gray-600 uppercase">
                  <div className="w-1/12 px-6 py-6">Index</div>
                  <div className="w-1/4 px-6 py-6">Domain name</div>
                  <div className="w-1/4 px-6 py-6">Assignees</div>
                  <div className="w-1/4 px-6 py-6">Consumer key</div>
                  <div className="w-1/4 px-6 py-6">Secret key</div>
                  <div className="w-1/6 px-6 py-6">Action</div>
                </div>
              </div>
              <div className="w-full overflow-x-hidden overflow-y-auto bg-white max-h-500px">
                {data.results.length > 0 ? (
                  data.results.map((store, index) => (
                    <div key={store.id} className="flex border-b border-gray-200">
                      <div className="w-1/12 px-6 py-6 ">{index + 1}</div>
                      <div className="w-1/4 px-6 py-6 text-blue-500 cursor-pointer hover:underline">
                        {truncateLongText(store.domain_name, 20)}
                      </div>
                      <div className="w-1/4 px-6 py-6 ">{getAssignedUsers(store.users)}</div>
                      <div className="w-1/4 px-6 py-6 ">{truncateLongText(store.consumer_key, 20)}</div>
                      <div className="w-1/4 px-6 py-6 ">{truncateLongText(store.secret_key, 20)}</div>
                      <div className="w-1/6 px-6 py-6 ">
                        <button
                          type="button"
                          className="font-medium text-red-500 uppercase hover:underline hover:text-red-400"
                          onClick={() => onDeleteStore(store.id)}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="ml-6 font-medium text-blue-500 uppercase hover:underline hover:text-blue-400"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-row items-center justify-center text-3xl text-red-500 min-h-400px">
                    <NoRecordFound />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full mt-10">
              <div className="text-2xl text-gray-700">
                <p>{`Showing ${data.results.length} of ${data.count} records.`}</p>
              </div>
              {data.next ||
                (data.previous && (
                  <Paginator
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    count={data.count}
                    next={data.next}
                    previous={data.previous}
                    limit={10}
                  />
                ))}
            </div>
          </>
        ) : null}
      </div>
      {modalState.isModalOpen && modalState.openDeleteStoreModal && <DeleteStoreModal mutation={mutation} />}
    </>
  )
}

export default StoreList
