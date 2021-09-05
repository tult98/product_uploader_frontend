import React, { useState, createContext } from 'react'

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    openCreateAttributeModal: false,
    openDeleteAttributeModal: false,
    openCreateOptionModal: false,
    isModalOpen: false,
    attributeIndex: null,
  })

  return <ModalContext.Provider value={{ modalState, setModalState }}>{children}</ModalContext.Provider>
}

export default ModalContext
