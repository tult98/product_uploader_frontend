import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-query'
import Icon from 'components/elements/Icon'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import AuthServices from 'services/AuthService'
import AuthenticationContext from 'context/AuthenticationContext'
import { colors } from 'theme/variables/platform'
import { debounce, DEFAULT_DELAY } from 'utils/commonUtils'
import { login } from 'utils/authUtils'
import { UNKNOWN_ERROR_MESSAGE } from 'utils/errorsUtils'
import { GENERAL_ROUTES } from 'routes'

const LoginInputForm = () => {
  const [authInput, setAuthInput] = useState({ username: '', password: '' })
  const { setUser } = useContext(AuthenticationContext)
  const history = useHistory()
  const mutation = useMutation(AuthServices.login)

  useEffect(() => {
    // prettier-ignore
    (async () => {
      if (mutation.isSuccess) {
        const token = mutation.data
        login({ access_token: token.access, refresh_token: token.refresh })
        const me = await AuthServices.getMe()
        setUser(me)
        history.push(GENERAL_ROUTES.HOME)
      }
    })()
  }, [mutation.status])

  const onChangeInput = ({ target: { name, value } }) => {
    debounce(() => {
      setAuthInput({ ...authInput, [name]: value })
    }, DEFAULT_DELAY)()
  }

  const onSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(authInput)
  }

  const onLoginByEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      mutation.mutate(authInput)
    }
  }

  return (
    <>
      {mutation.isLoading && <LoadingIndicator style="w-16 h-16 center-content" />}
      <div className="w-1/2 max-w-screen-sm px-16 py-20 bg-white shadow-grayShadow center-content rounded-3xl">
        <p className="mb-20 text-5xl font-semibold text-center uppercase">Login</p>
        <form className="text-gray-700" onKeyDown={onLoginByEnter}>
          <div className="relative flex flex-col">
            <label className="mb-4 ">User name</label>
            <Icon name="user" fill={colors.lightGray} style="w-12 h-12 absolute bottom-4" />
            <input
              type="text"
              className="py-3 pl-16 border-b-2 border-gray-300 focus:outline-none"
              placeholder="Type your user name"
              name="username"
              onChange={onChangeInput}
            />
          </div>
          <div className="relative flex flex-col mt-8">
            <label className="mb-4">Password</label>
            <Icon name="password" fill={colors.lightGray} style="w-12 h-12 absolute bottom-4" />
            <input
              type="password"
              className="py-3 pl-16 border-b-2 border-gray-300 focus:outline-none"
              placeholder="Type your password"
              name="password"
              autoComplete="true"
              onChange={onChangeInput}
            />
          </div>
          <p className="mt-8 italic text-right">
            Do not have an account? Leave a message to admin{' '}
            <span className="text-blue-700 cursor-pointer hover:underline">here</span>
          </p>
          <div className="flex items-center justify-center mt-20 text-white100 ">
            <button
              className="flex justify-center w-2/3 py-8 text-3xl font-bold rounded-full bg-primaryBlue hover:opacity-75"
              onClick={onSubmit}
            >
              {mutation.isLoading && <LoadingIndicator style="w-8 h-8" color={colors.white100} />}
              <p className="ml-2">Login</p>
            </button>
          </div>
        </form>
        {mutation.isError && (
          <p className="mt-4 input-error">
            * {mutation.error.errors.detail || mutation.error.errors.message || UNKNOWN_ERROR_MESSAGE}
          </p>
        )}
      </div>
    </>
  )
}

export default LoginInputForm
