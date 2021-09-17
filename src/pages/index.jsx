import React, { useContext } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { TEMPLATE_ROUTES } from 'routes'
import NotificationContext from 'context/NotificationContext'
import NotificationPopup from 'components/elements/NotificationPopup'
import { ReactQueryDevtools } from 'react-query/devtools'
import CreateTemplatePage from 'pages/create-template'
import ListTemplatePage from 'pages/list-template'
import EditTemplatePage from 'pages/edit-template'
import Navigation from 'components/layouts/Navigation'

const IndexPage = () => {
  const { notificationState } = useContext(NotificationContext)
  return (
    <div className="flex flex-col">
      <Router>
        <Switch>
          <Route path={TEMPLATE_ROUTES.LIST_TEMPLATE} exact>
            <ListTemplatePage />
          </Route>
          <Route path={TEMPLATE_ROUTES.CREATE_TEMPLATE} exact>
            <CreateTemplatePage />
          </Route>
          <Route path={TEMPLATE_ROUTES.GET_TEMPLATE} exact>
            <EditTemplatePage />
          </Route>
        </Switch>
        <Navigation />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      {notificationState.isShow && <NotificationPopup />}
    </div>
  )
}

export default IndexPage
