import { Modal, Button } from 'react-bootstrap';
import { HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutModal = ({ show, onHide }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = () => {
    logout();
    onHide();
    navigate('/login', { replace: true });
  };

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
          <HiOutlineLogout size={36} />
        </div>
        
        <h4 className="mb-2" style={{ color: 'var(--text-heading)', fontWeight: '700' }}>Ready to leave?</h4>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.95rem' }} className="mb-4">
          Are you sure you want to sign out of the CRM Manager? You will need to log back in to access your dashboard.
        </p>
        
        <div className="d-flex gap-3 justify-content-center">
          <Button 
            variant="secondary" 
            onClick={onHide}
            className="w-50 btn-modal-cancel fw-semibold"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm}
            className="w-50 fw-semibold d-flex align-items-center justify-content-center gap-2 border-0"
            style={{ borderRadius: '8px', background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            <HiOutlineLogout size={18} /> Sign Out
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LogoutModal;
