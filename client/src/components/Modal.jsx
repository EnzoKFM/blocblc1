import './Modal.css'

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className='modal' onClick={onClose}>
      <div className='modal-div' onClick={(e) => e.stopPropagation()}>
        <button className='modal-button' onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Modal