import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-query'
import Icon from 'components/elements/Icon'
import LoadingIndicator from 'components/elements/LoadingIndicator'
import AuthServices from 'services/AuthService'
import AuthenticationContext from 'context/AuthenticationContext'
import { colors } from 'theme/variables/platform'
import { login, replaceAccountInfoIncorrect } from 'utils/authUtils'
import { validateRequired } from 'utils/validators'
import { PRODUCT_ROUTES } from 'routes'

const LoginInputForm = () => {
  const [authInput, setAuthInput] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isShowPassword, setIsShowPassword] = useState(false)
  const { setUser } = useContext(AuthenticationContext)
  const history = useHistory()
  const mutation = useMutation(AuthServices.login)

  useEffect(() => {
    if (mutation.isError) {
      !mutation.error.errors.detail && setErrors(mutation.error.errors)
    }
    // prettier-ignore
    (async () => {
      if (mutation.isSuccess) {
        const token = mutation.data
        login({ access_token: token.access, refresh_token: token.refresh })
        const me = await AuthServices.getMe()
        setUser(me)
        history.push(PRODUCT_ROUTES.UPLOAD_PRODUCT)
      }
    })()
  }, [mutation.status])

  const onChangeInput = ({ target: { name, value } }) => {
    setAuthInput({ ...authInput, [name]: value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (Object.keys(errors).length > 0) {
      return
    }
    mutation.mutate(authInput)
  }

  const onValidateInputField = ({ target }) => {
    if (!validateRequired(target.value)) {
      delete errors[target.name]
    } else {
      setErrors({ ...errors, [target.name]: [validateRequired(target.value)] })
    }
  }

  const onToggleShowPassword = () => {
    setIsShowPassword(!isShowPassword)
  }

  const onForgetPassword = () => {
    alert('Please contact admin to reset password')
  }

  return (
    <>
      <div className="w-1/2 max-w-screen-sm px-16 py-20 bg-white shadow-grayShadow center-content rounded-3xl">
        <p className="mb-20 text-5xl font-semibold text-center uppercase">Login</p>
        <form className="text-gray-700" onSubmit={onSubmit}>
          <div className="flex flex-col">
            <label name="username" className="mb-4 font-medium">
              Username
            </label>
            <div className="relative w-full">
              <Icon name="user" fill={colors.lightGray} style="w-12 h-12 absolute bottom-4" />
              <input
                type="text"
                className="w-full py-3 pl-16 border-b-2 border-gray-300 focus:outline-none"
                placeholder="Type your user name"
                name="username"
                id="username"
                onChange={onChangeInput}
                onBlur={onValidateInputField}
              />
            </div>
            {!!errors.username && (
              <>
                {errors.username.map((error, index) => (
                  <p className="input-error" key={index}>
                    {error}
                  </p>
                ))}
              </>
            )}
          </div>
          <div className="flex flex-col mt-8">
            <label name="password" className="mb-4 font-medium">
              Password
            </label>
            <div className="relative flex flex-row items-center w-full">
              <Icon name="password" fill={colors.lightGray} style="w-12 h-12 absolute bottom-4" />
              <input
                type={isShowPassword ? 'text' : 'password'}
                name="password"
                className="w-full py-3 pl-16 border-b-2 border-gray-300 focus:outline-none"
                placeholder="Type your password"
                onChange={onChangeInput}
                onBlur={onValidateInputField}
              />
              <div className="absolute cursor-pointer right-4" onClick={onToggleShowPassword}>
                <Icon name={!isShowPassword ? 'eye' : 'eyeOff'} style="w-10 h-10" fill={colors.darkGray} />
              </div>
            </div>
            {!!errors.password && (
              <>
                {errors.password.map((error, index) => (
                  <p className="input-error" key={index}>
                    {error}
                  </p>
                ))}
              </>
            )}
          </div>
          <p className="mt-8 italic text-right text-blue-600 cursor-pointer hover:underline" onClick={onForgetPassword}>
            Forget your password?
          </p>
          <div className="flex items-center justify-center mt-20 text-white100 ">
            <button
              type="submit"
              className="flex justify-center w-2/3 py-8 text-3xl font-bold bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none"
            >
              {mutation.isLoading && <LoadingIndicator style="w-8 h-8" color={colors.white100} />}
              <p className="ml-2">Login</p>
            </button>
          </div>
        </form>
        {mutation.error && mutation.error.errors.detail && (
          <p className="mt-4 input-error">* {replaceAccountInfoIncorrect(mutation.error)}</p>
        )}
      </div>
    </>
  )
}

export default LoginInputForm
