import React, { useContext } from 'react'
import NotificationPopup from 'components/elements/NotificationPopup'
import NotificationContext from 'context/NotificationContext'

const IndexPage = () => {
  const { notificationState } = useContext(NotificationContext)

  return (
    <>
      <header>
        <title>Product Uploader | Home</title>
      </header>
      {notificationState.isShow && <NotificationPopup />}
    </>
  )
}

export default IndexPage
