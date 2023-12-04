import React from 'react';

interface ModalProps {
  isOpen: boolean;
  // onClose: () => void;
  children: React.ReactNode;
  // nameButon: string;
}

function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-background">
      <div className="modal">
        {children}
        {/* <button onClick={onClose} type="button">
          {nameButon}
        </button> */}
      </div>
    </div>
  );
}

export default Modal;
