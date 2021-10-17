export const TEMPLATE_ROUTES = {
  LIST_TEMPLATE: '/templates/',
  CREATE_TEMPLATE: '/templates/create',
  GET_TEMPLATE: '/templates/:templateId',
}

export const GENERAL_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
}

export const PRODUCT_ROUTES = {
  LIST_PRODUCT: '/products',
  UPLOAD_PRODUCT: '/products/upload',
  CREATE_PRODUCT: '/products/create',
  GET_PRODUCT: '/products/:productId',
  GET_LOGS: '/products/upload/logs',
  UPDATE: '/products/update',
}

export const STORE_ROUTES = {
  LIST_STORE: '/stores',
  CREATE_STORE: '/stores/create',
}

export const NON_NAVIGATION_ROUTES = [GENERAL_ROUTES.LOGIN]
