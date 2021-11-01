import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import IndexPage from 'pages/index'
import ListTemplatePage from 'pages/list-template'
import CreateTemplatePage from 'pages/create-template'
import EditTemplatePage from 'pages/edit-template'
import UploadProductPage from 'pages/upload-product'
import UploadProductLogsPage from 'pages/upload-product-logs'
import EditProductsPage from 'pages/edit-products'
import LoginPage from 'pages/login'
import ListStorePage from 'pages/list-store'
import CreateStorePage from 'pages/create-store'
import EditStorePage from 'pages/edit-store'
import ListUserPage from 'pages/list-users'
import DetailUserPage from 'pages/user-detail'
import UserCreatePage from 'pages/user-create'
import Navigation from 'components/layouts/Navigation'
import { ModalProvider } from 'context/ModalContext'
import { NotificationProvider } from 'context/NotificationContext'
import { AuthenticationProvider } from 'context/AuthenticationContext'
import { GENERAL_ROUTES, PRODUCT_ROUTES, STORE_ROUTES, TEMPLATE_ROUTES, USER_ROUTES } from 'routes'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ModalProvider>
          <NotificationProvider>
            <AuthenticationProvider>
              <div className="flex flex-col">
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
                  <Route path={PRODUCT_ROUTES.UPDATE} exact>
                    <EditProductsPage />
                  </Route>

                  <Route path={STORE_ROUTES.LIST_STORE} exact>
                    <ListStorePage />
                  </Route>
                  <Route path={STORE_ROUTES.CREATE_STORE} exact>
                    <CreateStorePage />
                  </Route>
                  <Route path={STORE_ROUTES.EDIT_STORE} exact>
                    <EditStorePage />
                  </Route>
                  <Route path={GENERAL_ROUTES.LOGIN} exact>
                    <LoginPage />
                  </Route>
                  <Route path={USER_ROUTES.LIST_USERS} exact>
                    <ListUserPage />
                  </Route>
                  <Route path={USER_ROUTES.CREATE_USER} exact>
                    <UserCreatePage />
                  </Route>
                  <Route path={USER_ROUTES.EDIT_USER} exact>
                    <DetailUserPage />
                  </Route>
                </Switch>
                <Navigation />
                <IndexPage />
                <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
              </div>
            </AuthenticationProvider>
          </NotificationProvider>
        </ModalProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
