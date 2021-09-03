import axios from 'axios'
import { ERROR_UNKNOWN, SUCCESS_STATUS_CODE } from 'utils/responseUtils'

const DEFAULT_REQUEST_CONFIG = {
  withAuthorization: true,
  // TODO: get baseURL from environments variables
  baseURL: 'http://127.0.0.1:8000',
}

const injectAuthorizationHeader = (config = {}) => {
  if (!config.withAuthorization) {
    return
  }

  // TODO: get the authToken from cookies, localStorage
  const authToken = 'thisIsAuthToken'
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

const BaseService = {
  get(url, data = {}, config = DEFAULT_REQUEST_CONFIG) {
    if (data.params) {
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

  delete(url, data = {}, config = DEFAULT_REQUEST_CONFIG) {
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
}

export default BaseService
