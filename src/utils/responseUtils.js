export const ERROR_CODES = {
  GENERAL_ERROR: 4000,
}

export const ERROR_UNKNOWN = {
  code: ERROR_CODES.GENERAL_ERROR,
  errors: {
    message: 'Something went wrong, please re-try later!',
  },
}

export const SUCCESS_STATUS_CODE = [200, 201, 204]
export const DEFAULT_MESSAGE_SUCCESS = 'The operation is successful!'
export const DEFAULT_MESSAGE_FAILED = 'The operation failed'
