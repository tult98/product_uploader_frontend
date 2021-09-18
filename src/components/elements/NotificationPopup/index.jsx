import React, { useContext, useState, useEffect } from 'react'
import Icon from 'components/elements/Icon'
import NotificationContext from 'context/NotificationContext'
import { DEFAULT_SHOW_TIME } from 'utils/commonUtils'
import { colors } from 'theme/variables/platform'

const NotificationPopup = () => {
  const { notificationState, setNotificationState } = useContext(NotificationContext)
  const [isShow, setIsShow] = useState(notificationState.isShow)

  setTimeout(() => {
    setIsShow(false)
  }, DEFAULT_SHOW_TIME)

  useEffect(() => {
    if (!isShow) {
      const timer = setTimeout(() => {
        setNotificationState({ type: null, message: null, isShow: false })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isShow])

  return (
    <div
      className={`fixed flex items-center justify-start px-12 py-4 text-white100 transition-all bg-gray-900 top-32 w-96 duration-300 ${
        notificationState.type === 'success' ? 'shadow-greenShadow' : 'shadow-redShadow'
      } ${isShow ? 'slideIn' : 'slideOut'}`}
    >
      <Icon
        name="bell"
        style="w-16 h-16 mr-2"
        fill={`${notificationState.type === 'success' ? colors.primaryGreen : colors.lightRed}`}
      />
      <span className="leading-7 text-left">{notificationState.message}</span>
    </div>
  )
}

export default NotificationPopup
