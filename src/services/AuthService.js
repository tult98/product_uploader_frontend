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
    return await BaseService.get(`users/?offset=${offset}&search=${searchPattern}&limit=${limit}`)
  }
  static async deleteUser(userId) {
    return await BaseService.delete(`users/${userId}`)
  }

  static async editUser({ userId, userData }) {
    return await BaseService.put(`/users/${userId}`, userData, {})
  }
  static async queryUser({ queryKey }) {
    const [_key, { userId }] = queryKey /* eslint-disable-line */
    return await BaseService.get(`/users/${userId}`, {})
  }

  static async createUser(userData) {
    return await BaseService.post(`users/`, userData)
  }
}
