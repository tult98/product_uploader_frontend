import IntroducePage from 'components/widgets/IntroducePage'
import UsersTable from 'components/widgets/UsersTable'
import React from 'react'

const ListUserPage = () => {
  return (
    <>
      <header>
        <title>Product Uploader | All Users</title>
      </header>
      <div className="main-content">
        <div className="w-full">
          <IntroducePage name="user" title="User Dashboard" description="This is where you control all your User." />
          <UsersTable />
        </div>
      </div>
    </>
  )
}

export default ListUserPage
