import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import NotificationContext from 'context/NotificationContext'
import { USER_ROUTES } from 'routes'
import AuthServices from 'services/AuthService'
import { colors } from 'theme/variables/platform'
import { numberRequiredField, textRequiredField, validateEmail } from 'utils/errorsUtils'
import ToolTip from 'components/elements/ToolTip'
import PasswordInput from 'components/elements/Input/PasswordInput'

const optionRole = [
  { value: 1, label: 'User' },
  { value: 2, label: 'Admin' },
  { value: 3, label: 'Super Admin' },
]

const generateRandomPassword = (length = 8) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const UserInput = ({ user = {}, isEdit = false }) => {
  const history = useHistory()

  const [userInput, setUserInput] = useState({
    email: user.email || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    role: user.role || '',
    password: '',
    wp_username: user.wp_username || '',
    wp_password: user.wp_password || '',
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
    setUserInput({
      ...userInput,
      [name]: value,
    })
  }

  const onChangeUsers = (selectedUsers) => {
    setUserInput({ ...userInput, role: selectedUsers.value })
  }

  const onValidateForm = () => {
    let errors = {}
    Object.keys(userInput).forEach((key) => {
      if (key === 'email') {
        errors = { ...errors, ...validateEmail(key, userInput[key]) }
      } else if (key === 'role') {
        errors = { ...errors, ...numberRequiredField(key, userInput[key]) }
      } else if (key === 'password') {
        errors = isEdit ? errors : { ...errors, ...textRequiredField(key, userInput[key]) }
      } else {
        errors = { ...errors, ...textRequiredField(key, userInput[key]) }
      }
    })
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onValidateField = (event) => {
    if (event.target.name === 'email') {
      setErrors({ ...errors, ...validateEmail(event.target.name, event.target.value) })
    } else if (event.target.name === 'role') {
      setErrors({ ...errors, ...numberRequiredField(event.target.name, event.target.value) })
    } else if (event.target.name === 'password') {
      !isEdit && setErrors({ ...errors, ...textRequiredField(event.target.name, event.target.value) })
    } else {
      setErrors({ ...errors, ...textRequiredField(event.target.name, event.target.value) })
    }
  }

  const onGeneratePassword = () => {
    const randomPassword = generateRandomPassword()
    setUserInput({ ...userInput, password: randomPassword })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (onValidateForm()) {
      if (!isEdit) {
        mutation.mutate(userInput)
      } else {
        delete userInput.password
        const userData = { ...userInput }
        mutation.mutate({ id: user.id, data: userData })
      }
    }
  }

  const onCancel = () => {
    history.push(USER_ROUTES.LIST_USERS)
  }

  return (
    <div className="flex justify-center w-full">
      <form className="w-2/5 px-12 py-20 my-20 bg-white shadow-grayShadow rounded-2xl">
        <div className="flex flex-col">
          <label htmlFor="email" className="font-base">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={user?.email || ''}
            className="px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
            onBlur={onValidateField}
            onChange={onChangeTextInput}
          />
          {errors['email'] && <p className="input-error">{errors['email']}</p>}
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="first_name" className="font-base">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            defaultValue={user?.first_name || ''}
            className="px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
            onBlur={onValidateField}
            onChange={onChangeTextInput}
          />
          {errors['first_name'] && <p className="input-error">{errors['first_name']}</p>}
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="last_name" className="font-base">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            defaultValue={user?.last_name || ''}
            className="px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
            onBlur={onValidateField}
            onChange={onChangeTextInput}
          />
          {errors['last_name'] && <p className="input-error">{errors['last_name']}</p>}
          <div className="flex flex-col mt-4">
            <label htmlFor="username" className="font-base">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={user?.username || ''}
              className="px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
              onBlur={onValidateField}
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
            onBlur={onValidateField}
            onChange={onChangeUsers}
          />
          {errors['role'] && <p className="input-error">{errors['role']}</p>}
        </div>
        <div className="flex flex-col mt-4">
          <label htmlFor="password" className="font-base">
            Password
          </label>
          <PasswordInput
            name="password"
            value={userInput.password}
            onChange={onChangeTextInput}
            onBlur={onValidateField}
          />
          {errors && errors['password'] && <p className="input-error">{errors['password']}</p>}
          <a type="button" className="mt-3 text-blue-600 cursor-pointer hover:underline" onClick={onGeneratePassword}>
            Generate a random password
          </a>
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row">
            <label htmlFor="domain-name" className="mr-3 font-base">
              WP Username
            </label>
            <ToolTip message="This information will use for uploading product's images." />
          </div>
          <div className="relative flex flex-row items-center w-full">
            <input
              type="text"
              name="wp_username"
              defaultValue={userInput.wp_username}
              value={userInput.wp_username}
              className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none"
              onBlur={onValidateField}
              onChange={onChangeTextInput}
            />
          </div>
          {errors && errors['wp_username'] && <p className="input-error">{errors['wp_username']}</p>}
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex flex-row">
            <label htmlFor="wp_password" className="mr-3 font-base">
              WP Password
            </label>
            <ToolTip message="This information will use for uploading product's images." />
          </div>
          <PasswordInput
            name="wp_password"
            value={userInput.wp_password}
            onChange={onChangeTextInput}
            onBlur={onValidateField}
          />

          {errors && errors['wp_password'] && <p className="input-error">{errors['wp_password']}</p>}
        </div>
        <div className="flex justify-end w-full mt-10">
          <button
            type="button"
            className="px-12 py-4 mr-4 text-white rounded-full bg-darkGray opacity-80 hover:opacity-70"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center px-12 py-4 text-white rounded-full bg-primaryBlue hover:opacity-80"
            onClick={onSubmit}
          >
            {mutation.isLoading && <LoadingIndicator style="w-8 h-8 mr-2" color={colors.white100} />}
            {isEdit ? 'Save' : 'Create'}
          </button>
        </div>
        {/* {isError && <p>{error.errors.detail || 'Something went wrong, Please try later!'}</p>} */}
      </form>
    </div>
  )
}

export default UserInput
