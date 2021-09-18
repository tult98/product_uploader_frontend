import BaseService from './BaseService'
import WPServices from './WPServices'

const PRODUCT_URL = 'products/'

export default class ProductServices {
  static async createProduct({ data }) {
    WPServices.uploadImage()
    return await BaseService.post(`${PRODUCT_URL}`, {}, data)
  }
}
