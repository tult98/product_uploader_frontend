import { DEFAULT_LIMIT } from 'utils/commonUtils'

const { default: BaseService } = require('./BaseService')

const STORE_URL = 'stores'

export default class StoreService {
  static async createStore(storeData) {
    return await BaseService.post(`${STORE_URL}/`, storeData)
  }

  static async queryStores({ queryKey }) {
    const [_key, { currentPage, searchPattern, limit }] = queryKey /* eslint-disable-line */
    const offset = (currentPage - 1) * (limit || DEFAULT_LIMIT)
    return await BaseService.get(`${STORE_URL}/?offset=${offset}&search=${searchPattern}&limit=${limit}`, null)
  }

  static async deleteStore(id) {
    return BaseService.delete(`${STORE_URL}/${id}`)
  }

  static async queryStore({ queryKey }) {
    const [_key, { storeId }] = queryKey /* eslint-disable-line */
    return await BaseService.get(`${STORE_URL}/${storeId}`)
  }

  static async editStore({ storeId, storeData }) {
    return await BaseService.put(`${STORE_URL}/${storeId}`, storeData)
  }
}
