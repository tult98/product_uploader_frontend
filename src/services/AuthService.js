import BaseService from './BaseService'

const AUTH_URL = 'auth'

export default class AuthServices {
  static async login(authInput) {
    return await BaseService.post(`${AUTH_URL}/jwt/create/`, authInput, {})
  }

  static async getMe() {
    return await BaseService.get(`${AUTH_URL}/users/me/`)
  }

  static async queryUsers() {
    return await BaseService.get(`${AUTH_URL}/users/`)
  }
}
