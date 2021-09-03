import BaseService from 'services/BaseService'

const WOO_BASE_URL = 'https://yourgears.net/wp-json/wc/v3'
const CONSUMER_KEY = 'ck_314aa3b442262eee58ab8eb25147e0e89e52a587'
const CONSUMER_SECRET = 'cs_e17b1d2677df1b12e2ec54540bec0fe37bac5789'
const authorizeValue = `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`

export default class WooServices {
  static async queryCategories() {
    return await BaseService.get(`/products/categories?${authorizeValue}`, { baseURL: WOO_BASE_URL }, {})
  }
}
