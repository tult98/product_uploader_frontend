import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import IndexPage from 'pages'
import ListTemplatePage from 'pages/list-template'
import CreateTemplatePage from 'pages/create-template'
import EditTemplatePage from 'pages/edit-template'
import UploadProductPage from 'pages/upload-product'
import UploadProductLogsPage from 'pages/upload-product-logs'
import EditProductsPage from 'pages/edit-products'
import Navigation from 'components/layouts/Navigation'
import { ModalProvider } from 'context/ModalContext'
import { NotificationProvider } from 'context/NotificationContext'
import { PRODUCT_ROUTES, TEMPLATE_ROUTES } from 'routes'

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
                <Route path={PRODUCT_ROUTES.UPLOAD_PRODUCT} exact>
                  <UploadProductPage />
                </Route>
                <Route path={PRODUCT_ROUTES.GET_LOGS} exact>
                  <UploadProductLogsPage />
                </Route>
                <Route path={PRODUCT_ROUTES.EDIT} exact>
                  <EditProductsPage />
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
