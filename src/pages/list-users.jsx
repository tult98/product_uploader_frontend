import UsersTable from 'components/widgets/UsersTable'
import React from 'react'

const ListUserPage = () => {
  return (
    <>
      <header>
        <title>Product Uploader | All Users</title>
      </header>
      <div className="main-content">
        <UsersTable />
      </div>
    </>
  )
}

export default ListUserPage
