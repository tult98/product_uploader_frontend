import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CreateTemplatePage from 'pages/create-template'
import ListTemplatePage from 'pages/list-template'
import { TEMPLATE_ROUTES } from 'routes'

function App() {
  return (
    <Router>
      <Link to={TEMPLATE_ROUTES.LIST_TEMPLATE}>List all templates</Link>
      <Link to={TEMPLATE_ROUTES.CREATE_TEMPLATE}>Create a template</Link>
      <Switch>
        <Route path={TEMPLATE_ROUTES.LIST_TEMPLATE}>
          <ListTemplatePage />
        </Route>
        <Route path={TEMPLATE_ROUTES.CREATE_TEMPLATE}>
          <CreateTemplatePage />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
