import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import CreateTemplatePage from 'pages/create-template'
import ListTemplatePage from 'pages/list-template'
import { TEMPLATE_ROUTES } from 'routes'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </div>
    </QueryClientProvider>
  )
}

export default App
