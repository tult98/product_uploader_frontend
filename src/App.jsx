import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import IndexPage from 'pages'
import ListTemplatePage from 'pages/list-template'
import CreateTemplatePage from 'pages/create-template'
import EditTemplatePage from 'pages/edit-template'
import Navigation from 'components/layouts/Navigation'
import { ModalProvider } from 'context/ModalContext'
import { NotificationProvider } from 'context/NotificationContext'
import { TEMPLATE_ROUTES } from 'routes'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <NotificationProvider>
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
              <IndexPage />
              <Navigation />
            </Router>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </div>
        </NotificationProvider>
      </ModalProvider>
    </QueryClientProvider>
  )
}

export default App
