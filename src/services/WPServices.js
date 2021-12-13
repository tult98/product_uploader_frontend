import BaseService from 'services/BaseService'

// const WP_BASE_URL = 'https://yourgears.net/wp-json/wp/v2'
// const AUTH_ACCOUNT = {
//   username: 'tulethanh',
//   password: 'Tulethanh@123',
// }

const getWPBaseURLFromDomainName = (domainName) => {
  domainName.slice(-1) === '/' ? `${domainName}wp-json/wp/v2` : `${domainName}/wp-json/wp/v2`
}

export default class WPServices {
  static async uploadImage(data, productSku, domainName, wpAccount) {
    return await BaseService.post('/media', data, {
      baseURL: getWPBaseURLFromDomainName(domainName),
      auth: wpAccount,
      headers: {
        'Content-Disposition': `attachment; filename=${productSku}-${data.name}`,
      },
    })
  }

  static async uploadImages({ data, domainName, wpAccount }) {
    // 1. call api to upload images
    const images = []
    const errors = []
    await Promise.all(
      data.files.map(async (file) => {
        try {
          const result = await WPServices.uploadImage(file, data.sku, domainName, wpAccount)
          images.push({ id: result.id, src: result.source_url })
        } catch (error) {
          errors.push({ ...error, file: file.name })
        }
      }),
    )

    if (errors && errors.length > 0) {
      images.map(async (item) => {
        await WPServices.deleteImage(item.id, domainName, wpAccount)
      })
    }

    return { images, errors }
  }

  static async deleteImage(id, domainName, wpAccount) {
    return await BaseService.delete(`/media/${id}?force=true`, {
      baseURL: getWPBaseURLFromDomainName(domainName),
      auth: wpAccount,
    })
  }

  static async deleteImages(images, wpAccount) {
    const errors = []
    await Promise.all(
      images.map(async (file) => {
        try {
          await WPServices.deleteImage(file.id, wpAccount)
        } catch (error) {
          errors.push({ ...error, file: file.name })
        }
      }),
    )

    return { errors }
  }
}
