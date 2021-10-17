import BaseService from 'services/BaseService'

const WP_BASE_URL = 'https://yourgears.net/wp-json/wp/v2'
const AUTH_ACCOUNT = {
  username: 'tulethanh',
  password: 'Tulethanh@123',
}

export default class WPServices {
  static async uploadImage(data, productSku) {
    return await BaseService.post('/media', data, {
      baseURL: WP_BASE_URL,
      auth: AUTH_ACCOUNT,
      headers: {
        'Content-Disposition': `attachment; filename=${productSku}-${data.name}`,
      },
    })
  }

  static async updateImage(data, productSku) {
    return await BaseService.put(`/media/${data.id}`, null, {
      baseURL: WP_BASE_URL,
      auth: AUTH_ACCOUNT,
      headers: {
        'Content-Disposition': `attachment; filename=${productSku}-${data.name}`,
      },
    })
  }

  static async uploadImages({ data }) {
    // 1. call api to upload images
    const images = []
    const errors = []
    await Promise.all(
      data.files.map(async (file) => {
        try {
          const result = await WPServices.uploadImage(file, data.sku)
          images.push({ id: result.id, src: result.source_url })
        } catch (error) {
          errors.push({ ...error, file: file.name })
        }
      }),
    )

    if (errors && errors.length > 0) {
      images.map(async (item) => {
        await WPServices.deleteImage(item.id)
      })
    }

    return { images, errors }
  }

  static async deleteImage(id) {
    return await BaseService.delete(`/media/${id}?force=true`, null, {
      baseURL: WP_BASE_URL,
      auth: {
        username: 'tulethanh',
        password: 'Tulethanh@123',
      },
    })
  }

  static async deleteImages(images) {
    const errors = []
    await Promise.all(
      images.map(async (file) => {
        try {
          await WPServices.deleteImage(file.id)
        } catch (error) {
          errors.push({ ...error, file: file.name })
        }
      }),
    )

    return { errors }
  }
}
