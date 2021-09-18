import React, { useContext } from 'react'
import NotificationPopup from 'components/elements/NotificationPopup'
import NotificationContext from 'context/NotificationContext'

const IndexPage = () => {
  const { notificationState } = useContext(NotificationContext)

  return <>{notificationState.isShow && <NotificationPopup />}</>
}

export default IndexPage
