import BaseService from 'services/BaseService'

const TEMPLATE_URL = 'templates/'

export default class TemplateServices {
  static async queryTemplates() {
    return await BaseService.get(TEMPLATE_URL, {})
  }

  static async createTemplate(data) {
    return await BaseService.post(TEMPLATE_URL, {}, data)
  }
}
