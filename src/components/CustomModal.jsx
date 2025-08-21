import React from 'react';
import Modal from 'react-modal'
import '../styles/Modal.css';

Modal.setAppElement('#root') // importante para acessibilidade

export default function CustomModal(props) {
  const { 
    shouldClose, 
    isOpen, 
    onRequestClose,
    onAfterClose,
    title, 
    children, 
    footer,
    hasDelay,
    } = props

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onAfterClose={onAfterClose}
      shouldCloseOnOverlayClick={shouldClose}
      shouldCloseOnEsc={shouldClose}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      className={`modal-content-base ${hasDelay ? 'delay' : ''}`}
      overlayClassName="modal-overlay"
      closeTimeoutMS={300} // tempo da transição em ms
    >
      {title && <div className="modal-title">{title}</div>}
      <div className="modal-content">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </Modal>
  )
}