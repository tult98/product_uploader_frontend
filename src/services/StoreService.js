import { DEFAULT_LIMIT } from 'utils/commonUtils'

const { default: BaseService } = require('./BaseService')

const STORE_URL = 'stores'

export default class StoreService {
  static async createStore(storeData) {
    return await BaseService.post(`${STORE_URL}/`, storeData)
  }

  static async queryStores({ queryKey }) {
    const [_key, { currentPage }] = queryKey /* eslint-disable-line */
    const offset = (currentPage - 1) * DEFAULT_LIMIT
    return await BaseService.get(`${STORE_URL}/?offset=${offset}`, null, {})
  }
}
