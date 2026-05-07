import { Modal, Button, Spinner } from 'react-bootstrap';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const ConfirmModal = ({ show, onHide, onConfirm, title, message, isProcessing = false }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="modal-header-custom border-bottom-0 pb-0">
        <Modal.Title className="modal-title-custom"></Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="modal-body-custom text-center pt-0">
        <div 
          className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-4"
          style={{ 
            width: '72px', 
            height: '72px', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger-color, #ef4444)'
          }}
        >
          <HiOutlineExclamationCircle size={36} />
        </div>
        
        <h4 className="mb-2" style={{ color: 'var(--text-heading)', fontWeight: '700' }}>{title}</h4>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }} className="mb-4">
          {message}
        </p>
        
        <div className="d-flex gap-3 justify-content-center">
          <Button 
            variant="secondary" 
            onClick={onHide}
            disabled={isProcessing}
            className="w-50 btn-modal-cancel fw-semibold"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-50 fw-semibold d-flex align-items-center justify-content-center gap-2 border-0"
            style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            {isProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
