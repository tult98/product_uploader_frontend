export const AlertError = (message) => {
  if (message !== '') {
    alert(message)
    return true
  }
  return false
}
