import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ModalProvider } from 'context/ModalContext'
import { NotificationProvider } from 'context/NotificationContext'

import IndexPage from 'pages'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <NotificationProvider>
          <IndexPage />
        </NotificationProvider>
      </ModalProvider>
    </QueryClientProvider>
  )
}

export default App
