import axios from 'axios'
import { getAccessToken, getRefreshToken, logout } from 'utils/authUtils'
import { LOCAL_STORAGE } from 'utils/commonUtils'
import { ERROR_UNKNOWN, SUCCESS_STATUS_CODE } from 'utils/responseUtils'

const DEFAULT_REQUEST_CONFIG = {
  withAuthorization: true,
  // TODO: get baseURL from environments variables
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://product-uploader-api.herokuapp.com/api/'
      : 'http://127.0.0.1:8000/api/',
}

axios.defaults.baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://product-uploader-api.herokuapp.com/api/'
    : 'http://127.0.0.1:8000/api/'

const injectAuthorizationHeader = (config = {}) => {
  if (!config.withAuthorization) {
    return
  }

  // TODO: get the authToken from cookies, localStorage
  const authToken = getAccessToken()
  if (authToken) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    }
  }
}
// indicate the get new access_token from refresh token are happening.
let isRefreshing = false
let failedQueue = []

const processQueue = async (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config

    if (error?.config?.url === 'auth/jwt/refresh/' && error?.response?.status === 401) {
      // failed at refresh token -> remove current token
      logout()
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      // unauthorize at create access_token
      if (error?.config.url === 'auth/jwt/create/') {
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return Promise.resolve(axios(originalRequest))
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        isRefreshing = false
        return Promise.reject(error)
      }
      return new Promise((resolve, reject) => {
        axios
          .post('auth/jwt/refresh/', { refresh: refreshToken })
          .then((res) => {
            const { data } = res
            window.localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, data.access)
            originalRequest.headers['Authorization'] = `Bearer ${data.access}`
            processQueue(null, data.access)
            resolve(axios(originalRequest))
          })
          .catch((err) => {
            processQueue(err, null)
            reject(err)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }
    return Promise.reject(error)
  },
)

const BaseService = {
  get(url, data = {}, config = DEFAULT_REQUEST_CONFIG) {
    if (data?.params) {
      config.params = data.params
    }

    injectAuthorizationHeader(config)
    config.data = {}

    return new Promise((resolve, reject) => {
      return axios
        .get(url, config)
        .then((res) => {
          const { data } = res
          if (res.status !== 200) {
            reject({ ...data })
          } else {
            resolve({ ...data })
          }
        })
        .catch((errors) => {
          if (errors.response?.data && errors?.response?.status < 4000) {
            reject({
              code: errors.response.status,
              errors: {
                ...errors.response.data,
              },
            })
          } else {
            reject(ERROR_UNKNOWN)
          }
        })
    })
  },

  post(url, data = {}, config = DEFAULT_REQUEST_CONFIG) {
    injectAuthorizationHeader(config)

    return new Promise((resolve, reject) => {
      axios
        .post(url, data, config)
        .then((res) => {
          const { data } = res
          if (!SUCCESS_STATUS_CODE.includes(res.status)) {
            reject({ ...data })
          } else {
            resolve({ ...data })
          }
        })
        .catch((errors) => {
          if (errors.response?.data && errors?.response?.status < 4000) {
            reject({
              code: errors.response.status,
              errors: {
                ...errors.response.data,
              },
            })
          } else {
            reject(ERROR_UNKNOWN)
          }
        })
    })
  },

  put(url, data = {}, config = DEFAULT_REQUEST_CONFIG) {
    injectAuthorizationHeader(config)

    return new Promise((resolve, reject) => {
      axios
        .put(url, data, config)
        .then((res) => {
          const { data } = res
          if (!SUCCESS_STATUS_CODE.includes(res.status)) {
            reject({ ...data })
          } else {
            resolve({ ...data })
          }
        })
        .catch((errors) => {
          if (errors.response?.data && errors?.response?.status < 4000) {
            reject({
              code: errors.response.status,
              errors: {
                ...errors.response.data,
              },
            })
          } else {
            reject(ERROR_UNKNOWN)
          }
        })
    })
  },

  delete(url, config = DEFAULT_REQUEST_CONFIG) {
    injectAuthorizationHeader(config)

    return new Promise((resolve, reject) => {
      axios
        .delete(url, config)
        .then((res) => {
          const { data } = res
          if (!SUCCESS_STATUS_CODE.includes(res.status)) {
            reject({ ...data })
          } else {
            resolve({ ...data })
          }
        })
        .catch((errors) => {
          if (errors.response?.data && errors?.response?.status < 4000) {
            reject({
              code: errors.response.status,
              errors: {
                ...errors.response.data,
              },
            })
          } else {
            reject(ERROR_UNKNOWN)
          }
        })
    })
  },
}

export default BaseService
