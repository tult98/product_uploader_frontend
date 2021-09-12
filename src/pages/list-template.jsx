import TemplateList from 'components/screens/TempateList'
import React from 'react'

const ListTemplatePage = () => {
  return (
    <>
      <header>
        <title>Product Uploader | Templates</title>
      </header>
      <div className="main-content">
        <TemplateList />
      </div>
    </>
  )
}

export default ListTemplatePage
