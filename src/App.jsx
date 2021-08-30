import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CreateTemplatePage from 'pages/create-template'
import ListTemplatePage from 'pages/list-template'
import { TEMPLATE_ROUTES } from 'routes'

function App() {
  return (
    <div className="flex flex-col">
      <Router>
        <Switch>
          <Route path={TEMPLATE_ROUTES.LIST_TEMPLATE} exact>
            <ListTemplatePage />
          </Route>
          <Route path={TEMPLATE_ROUTES.CREATE_TEMPLATE}>
            <CreateTemplatePage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
