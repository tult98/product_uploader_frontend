import LoadingIndicator from 'components/elements/LoadingIndicator'
import NotificationContext from 'context/NotificationContext'
import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router'
import { USER_ROUTES } from 'routes'
import AuthServices from 'services/AuthService'
import { colors } from 'theme/variables/platform'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import Select from 'react-select'
import { arrayRequiredField, numberRequiredField, textRequiredField, validateEmail, validateTemplateInput } from 'utils/errorsUtils'

const UserInput = ({ user = {}, isEdit = false }) => {
  const history = useHistory()

  console.log('user', user)
  const optionRole = [
    { value: 1, label: 'User' },
    { value: 2, label: 'Admin' },
    { value: 3, label: 'Super Admin' }
  ]
  const [userInput, setUserInput] = useState({
    email: user.email || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    role: user.role || '',
    password: '',
    confirmpassword: '',
  })
  const [errors, setErrors] = useState({})
  const { setNotificationState } = useContext(NotificationContext)
  const mutation = isEdit ? useMutation(AuthServices.editUser) : useMutation(AuthServices.createUser)
  useEffect(() => {
    if (mutation.isSuccess) {
      setNotificationState({
        type: 'success',
        message: isEdit ? 'Edit the store successful.' : 'Create a new store successful.',
        isShow: true,
      })
      if (!isEdit) {
        history.push(USER_ROUTES.LIST_USERS)
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
        message: isEdit ? 'Failed at edit the user.' : 'Failed at create a new user.',
        isShow: true,
      })
    }
  }, [mutation.status])

  const onChangeTextInput = ({ target: { name, value } }) => {
    debounce(() => {
      setUserInput({
        ...userInput,
        [name]: value,
      })
    }, DEFAULT_DELAY)()
  }

  const onChangeUsers = (selectedUsers) => {
    setUserInput({ ...userInput, role: selectedUsers.value })
  }

  const onValidateForm = () => {
    let errors = {}
    Object.keys(userInput).forEach((key) => {
      if (key === 'email') {
        errors = { ...errors, ...validateEmail(key, userInput[key]) }
      } else if (key === 'first_name') {
        errors = { ...errors, ...textRequiredField(key, userInput[key]) }
      } else if (key === 'last_name') {
        errors = { ...errors, ...textRequiredField(key, userInput[key]) }
      } else if (key === 'role') {
        errors = { ...errors, ...numberRequiredField(key, userInput[key]) }
      } else {
        errors = { ...errors, ...textRequiredField(key, userInput[key]) }
      }
    })
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (onValidateForm()) {
      if (!isEdit) {
        console.log('11111111111')
        mutation.mutate(userInput)
        console.log('userInput', userInput)
      } else {
        console.log('222222222222')
        const userData = { ...userInput }
        mutation.mutate({ userId: user.id, userData })
        console.log('userInput', userInput)
      }
    }
  }
  return (
    <div className="flex justify-center w-full">
      <form className="w-1/3 px-12 py-20 bg-white center-modal shadow-grayShadow rounded-2xl">
        <div className="flex flex-col">
          <label htmlFor="domain_name" className="font-base">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={user?.email || ''}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
          {errors['email'] && <p className="input-error">{errors['email']}</p>}
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="domain-name" className="font-base">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            defaultValue={user?.first_name || ''}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
          {errors['first_name'] && <p className="input-error">{errors['first_name']}</p>}
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="domain-name" className="font-base">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            defaultValue={user?.last_name || ''}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
          {errors['last_name'] && <p className="input-error">{errors['last_name']}</p>}
          <div className="flex flex-col mt-4">
            <label htmlFor="domain-name" className="font-base">
              User Name
            </label>
            <input
              type="text"
              name="username"
              defaultValue={user?.username || ''}
              className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
              onChange={onChangeTextInput}
            />
            {errors['username'] && <p className="input-error">{errors['username']}</p>}
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="role" className="font-base">
            Role User
          </label>
          <Select
            className="mt-4 "
            name="role"
            defaultValue={optionRole.find((role) => role.value === user.role)}
            options={optionRole}
            onChange={onChangeUsers}
          />
          {errors['role'] && <p className="input-error">{errors['role']}</p>}
          {/* {isError && <p className="input-error">{error.errors.detail || error.errors.message}</p>} */}
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="domain-name" className="font-base">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
        </div>

        <div className="flex flex-col mt-4">
          <label htmlFor="domain-name" className="font-base">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmpassword"
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none"
            onChange={onChangeTextInput}
          />
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
        {/* {isError && <p>{error.errors.detail || 'Something went wrong, Please try later!'}</p>} */}
      </form>
    </div>
  )
}

export default UserInput
