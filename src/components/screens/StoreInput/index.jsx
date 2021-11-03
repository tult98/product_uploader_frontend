import React, { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import Select from 'react-select'
import { useHistory } from 'react-router-dom'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import NotificationContext from 'context/NotificationContext'
import AuthServices from 'services/AuthService'
import StoreService from 'services/StoreService'
import { colors } from 'theme/variables/platform'
import { customStyles, debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { STORE_ROUTES } from 'routes'
import {
  arrayRequiredField,
  UNKNOWN_ERROR_MESSAGE,
  validateConsumerKey,
  validateConsumerSecret,
  validateDomainName,
} from 'utils/errorsUtils'

const StoreInput = ({ store = {}, isEdit = false }) => {
  const history = useHistory()
  const [storeInput, setStoreInput] = useState({
    domain_name: store.domain_name || '',
    consumer_key: store.consumer_key || '',
    secret_key: store.secret_key || '',
    users: store.users || [],
  })
  const [searchPattern, setSearchPatter] = useState('')
  const [errors, setErrors] = useState({})
  const { setNotificationState } = useContext(NotificationContext)

  const mutation = isEdit ? useMutation(StoreService.editStore) : useMutation(StoreService.createStore)
  const { isLoading, isError, isSuccess, error, data } = useQuery(
    ['query-users', { searchPattern, currentPage: 1 }],
    AuthServices.queryUsers,
  )

  useEffect(() => {
    if (mutation.isSuccess) {
      setNotificationState({
        type: 'success',
        message: isEdit ? 'Edit the store successful.' : 'Create a new store successful.',
        isShow: true,
      })
      if (!isEdit) {
        history.push(STORE_ROUTES.LIST_STORE)
      }
    } else if (mutation.isError) {
      if (mutation.error.code === 400) {
        // TODO: re-organize the errors to matching with response from server
        const errors = mutation.error.errors
        Object.keys(errors).forEach((key) => {
          errors[key] = errors[key][0]
        })
        setErrors(errors)
      }
      setNotificationState({
        type: 'error',
        message: isEdit ? 'Failed at edit the store.' : 'Failed at create a new store.',
        isShow: true,
      })
    }
  }, [mutation.status])

  const onChangeTextInput = ({ target: { name, value } }) => {
    debounce(() => {
      setStoreInput({
        ...storeInput,
        [name]: value,
      })
    }, DEFAULT_DELAY)()
  }

  const onChangeUsers = (selectedUsers) => {
    const selectedUserIds = selectedUsers.map((user) => user.id)
    setStoreInput({ ...storeInput, users: selectedUserIds })
  }

  const onValidateForm = () => {
    let errors = {}
    Object.keys(storeInput).forEach((key) => {
      if (key === 'domain_name') {
        errors = { ...errors, ...validateDomainName(storeInput[key]) }
      } else if (key === 'consumer_key') {
        errors = { ...errors, ...validateConsumerKey(storeInput[key]) }
      } else if (key === 'secret_key') {
        errors = { ...errors, ...validateConsumerSecret(storeInput[key]) }
      } else {
        errors = { ...errors, ...arrayRequiredField(key, storeInput[key]) }
      }
    })
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (onValidateForm()) {
      if (!isEdit) {
        mutation.mutate(storeInput)
      } else {
        const storeData = { ...storeInput }
        mutation.mutate({ storeId: store.id, storeData })
      }
    }
  }

  const onSearchUsers = (newInputValue) => {
    debounce(() => {
      setSearchPatter(newInputValue)
    }, DEFAULT_DELAY)()
  }

  return (
    <div className="flex justify-center w-full">
      <form className="w-1/3 px-12 py-20 bg-white center-modal shadow-grayShadow rounded-2xl">
        <div className="flex flex-col">
          <label htmlFor="domain_name" className="font-base">
            Domain name
          </label>
          <input
            type="text"
            name="domain_name"
            defaultValue={store?.domain_name || ''}
            className="px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
          {errors['domain_name'] && <p className="input-error">{errors['domain_name']}</p>}
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="domain-name" className="font-base">
            Consumer Key
          </label>
          <input
            type="text"
            name="consumer_key"
            defaultValue={store?.consumer_key || ''}
            className="px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
          {errors['consumer_key'] && <p className="input-error">{errors['consumer_key']}</p>}
        </div>

        <div className="flex flex-col mt-4">
          <label htmlFor="secret_key" className="font-base">
            Secret Key
          </label>
          <input
            type="text"
            name="secret_key"
            defaultValue={store?.secret_key || ''}
            className="px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
          {errors['secret_key'] && <p className="input-error">{errors['secret_key']}</p>}
        </div>

        <div className="flex flex-col mt-4">
          <label htmlFor="secret_key" className="font-base">
            Assign for user
          </label>
          <Select
            className="mt-4 "
            isMulti
            placeholder="Select user..."
            isLoading={isLoading}
            options={isSuccess ? data.results : []}
            defaultValue={store.users}
            styles={customStyles}
            getOptionLabel={(option) => option.username}
            getOptionValue={(option) => option.id}
            onChange={onChangeUsers}
            onInputChange={onSearchUsers}
          />
          {errors['users'] && <p className="input-error">{errors['users']}</p>}
          {isError && <p className="input-error">{error.errors?.detail || UNKNOWN_ERROR_MESSAGE}</p>}
        </div>
        <div className="flex justify-end w-full mt-10">
          <button
            type="button"
            className="px-12 py-4 mr-4 text-white rounded-full bg-darkGray opacity-80 hover:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center px-12 py-4 text-white rounded-full bg-primaryBlue hover:opacity-80"
            onClick={onSubmit}
          >
            {mutation.isLoading && <LoadingIndicator style="w-8 h-8 mr-2" color={colors.white100} />}
            {isEdit ? 'Edit' : 'Create'}
          </button>
        </div>
        {errors.detail && <p>{errors?.detail || UNKNOWN_ERROR_MESSAGE}</p>}
      </form>
    </div>
  )
}

export default StoreInput
