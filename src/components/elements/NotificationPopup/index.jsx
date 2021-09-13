import React, { useContext } from 'react'
import Icon from 'components/elements/Icon'
import NotificationContext from 'context/NotificationContext'
import { DEFAULT_SHOW_TIME } from 'utils/commonUtils'

const NotificationPopup = () => {
  const { notificationState, setNotificationState } = useContext(NotificationContext)

  setTimeout(() => {
    setNotificationState({ type: null, message: null, isShow: false })
  }, DEFAULT_SHOW_TIME)

  return (
    <div
      className={`fixed flex items-center justify-center px-8 py-4 text-gray-300 transition-all bg-gray-700 rounded-lg top-32 w-96 drop-shadow-2xl duration-300 shadow-xl ${
        notificationState.isShow ? 'slideIn' : 'slideOut'
      }`}
    >
      <Icon
        name="bell"
        style="w-16 h-16 mr-2"
        fill={`${notificationState.type === 'success' ? '#1f9c40' : '#fc0313'}`}
      />
      <span className="leading-7 text-left">{notificationState.message}</span>
    </div>
  )
}

export default NotificationPopup
