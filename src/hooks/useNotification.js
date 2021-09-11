import { useState } from 'react'

export const useNotification = () => {
  const [isShow, setIsShow] = useState(false)
  const [type, setType] = useState()
  const [message, setMessage] = useState()
  const [allowRedirect, setAllowRedirect] = useState(false)

  return {
    isShow,
    setIsShow,
    type,
    setType,
    message,
    setMessage,
    allowRedirect,
    setAllowRedirect,
  }
}
