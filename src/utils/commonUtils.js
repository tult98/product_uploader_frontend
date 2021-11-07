import { GENERAL_ROUTES, PRODUCT_ROUTES, STORE_ROUTES, TEMPLATE_ROUTES, USER_ROUTES } from 'routes'

export const DEFAULT_DELAY = 300
export const DEFAULT_SHOW_TIME = 3000
export const DEFAULT_LIMIT = 6

export const LOCAL_STORAGE = {
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  ME: '@me',
}

export const getNavigationItems = (isAdmin) => {
  if (isAdmin) {
    return [
      {
        name: 'home',
        route: GENERAL_ROUTES.HOME,
      },
      {
        name: 'template',
        child: [
          {
            name: 'all',
            route: TEMPLATE_ROUTES.LIST_TEMPLATE,
          },
          {
            name: 'new template',
            route: TEMPLATE_ROUTES.CREATE_TEMPLATE,
          },
        ],
      },
      {
        name: 'product',
        child: [
          {
            name: 'Create products',
            route: PRODUCT_ROUTES.UPLOAD_PRODUCT,
          },
          {
            name: 'Update products',
            route: PRODUCT_ROUTES.UPDATE,
          },
        ],
      },
      {
        name: 'store',
        child: [
          {
            name: 'all store',
            route: STORE_ROUTES.LIST_STORE,
          },
          {
            name: 'new store',
            route: STORE_ROUTES.CREATE_STORE,
          },
        ],
      },
      {
        name: 'users',
        child: [
          {
            name: 'All users',
            route: USER_ROUTES.LIST_USERS,
          },
          {
            name: 'new users',
            route: USER_ROUTES.CREATE_USER,
          },
        ],
      },
    ]
  }

  return [
    {
      name: 'home',
      route: GENERAL_ROUTES.HOME,
    },
    {
      name: 'product',
      child: [
        {
          name: 'Create products',
          route: PRODUCT_ROUTES.UPLOAD_PRODUCT,
        },
        {
          name: 'Update products',
          route: PRODUCT_ROUTES.UPDATE,
        },
      ],
    },
  ]
}

let timeoutId

export const debounce = (func, delay) => {
  return function () {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func()
    }, delay)
  }
}

export const removeSpace = (str) => {
  return str.replaceAll(' ', '')
}

export const calculateAvailablePages = (currentPage, totalPage) => {
  if (currentPage > totalPage) {
    return [currentPage]
  }
  const smallestPage = currentPage - 1 >= 1 ? currentPage - 1 : currentPage
  const largestPage = currentPage + 1 <= totalPage ? currentPage + 1 : totalPage
  const availablePages = []
  for (let i = smallestPage; i <= largestPage; i++) {
    availablePages.push(i)
  }
  if (availablePages.length < 3 && largestPage < totalPage) {
    availablePages.push(largestPage + 1)
  } else if (availablePages.length < 3 && smallestPage > 1) {
    availablePages.unshift(1)
  }
  return availablePages
}

export const truncateLongText = (text, expectedLength = 30) => {
  if (text.length > expectedLength) {
    return `${text.slice(0, expectedLength)}...`
  }
  return text
}

export const customStyles = {
  valueContainer: (provided) => ({
    ...provided,
    paddingTop: 5,
    paddingBottom: 5,
  }),
}
