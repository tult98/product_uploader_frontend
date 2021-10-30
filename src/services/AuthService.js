import BaseService from './BaseService'

const AUTH_URL = 'auth'

const DEFAULT_LIMIT = 10
export default class AuthServices {
  static async login(authInput) {
    return await BaseService.post(`${AUTH_URL}/jwt/create/`, authInput, {})
  }

  static async getMe() {
    return await BaseService.get(`${AUTH_URL}/users/me/`)
  }

  static async queryUsers({ queryKey }) {
    const [_key, { currentPage, searchPattern, limit }] = queryKey /* eslint-disable-line */
    const offset = (currentPage - 1) * (limit || DEFAULT_LIMIT)
    return await BaseService.get(`${AUTH_URL}/users/?offset=${offset}&search=${searchPattern}&limit=${limit}`)
  }
  static async deleteUsers({ userId }) {
    return await BaseService.delete(`${AUTH_URL}/users/${userId}`)
  }
}
