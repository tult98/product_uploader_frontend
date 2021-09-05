import BaseService from 'services/BaseService'

const TEMPLATE_ATTRIBUTE_URL = 'attributes/'

export default class TemplateAttributeServices {
  static async queryTemplateAttributes() {
    return await BaseService.get(TEMPLATE_ATTRIBUTE_URL, {})
  }

  static async createTemplateAttribute(data) {
    return await BaseService.post(TEMPLATE_ATTRIBUTE_URL, {}, data)
  }
}
