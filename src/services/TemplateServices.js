import BaseService from 'services/BaseService'
import { DEFAULT_LIMIT } from 'utils/commonUtils'

const TEMPLATE_URL = 'templates/'

export default class TemplateServices {
  static async queryTemplates({ queryKey }) {
    const [_key, { currentPage, searchPattern }] = queryKey /* eslint-disable-line */
    const offset = (currentPage - 1) * DEFAULT_LIMIT
    return await BaseService.get(`${TEMPLATE_URL}?offset=${offset}&search=${searchPattern}`, {
      withAuthorization: true,
    })
  }

  static async queryTemplate({ queryKey }) {
    const [_key, { id }] = queryKey /* eslint-disable-line */
    return await BaseService.get(`${TEMPLATE_URL}${id}`, { withAuthorization: true })
  }

  static async createTemplate(data) {
    return await BaseService.post(TEMPLATE_URL, data, { withAuthorization: true })
  }

  static async deleteTemplate({ id }) {
    return await BaseService.delete(`${TEMPLATE_URL}${id}`, { withAuthorization: true })
  }

  static async editTemplate({ id, data }) {
    return await BaseService.put(`${TEMPLATE_URL}${id}`, data, { withAuthorization: true })
  }
}
