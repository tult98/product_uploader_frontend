export const DEFAULT_DELAY = 500
export const DEFAULT_SHOW_TIME = 3000
export const DEFAULT_LIMIT = 6

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
