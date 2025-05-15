import React from 'react';
import '../styles/Modal.scss';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ show, onClose, children }: ModalProps) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="modal-header">{children}</div>
);

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="modal-body">{children}</div>
);

const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="modal-footer">{children}</div>
);

// Attach subcomponents
Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal as React.FC<ModalProps> & {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
};
