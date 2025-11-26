import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import './NotificationModal.scss';

function NotificationModal({ 
  isOpen, 
  onClose, 
  message, 
  type = 'success', // 'success' | 'error'
  autoClose = true,
  duration = 3000
}) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`notification-modal notification-modal--${type}`}>
      <div className="notification-modal__icon">
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      <p className="notification-modal__message">{message}</p>
      <button className="notification-modal__close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

export default NotificationModal;