import React, { useState, createContext } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notificationState, setNotificationState] = useState({
    type: null,
    message: null,
    isShow: false,
  })

  return (
    <NotificationContext.Provider value={{ notificationState, setNotificationState }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
