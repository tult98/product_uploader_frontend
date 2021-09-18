export const formatDate = (date) => {
  const year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? '0'.concat(date.getMonth() + 1) : date.getMonth() + 1
  return `${year}/${month}`
}
