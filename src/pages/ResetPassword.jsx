// src/pages/ResetPassword.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPasswordModal from '../components/ResetPasswordModal';
import { useAuth } from '../contexts/AuthContext';

function ResetPassword() {
  const [showModal, setShowModal] = useState(false);
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Check if there's a hash fragment (from password reset link)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    
    // If it's a password recovery link, show the modal
    if (type === 'recovery' && accessToken) {
      setIsRecoveryFlow(true);
      setShowModal(true);
    } else if (!isLoading && !isRecoveryFlow) {
      // Only redirect if not in recovery flow and not loading
      navigate('/');
    }
  }, [isLoading, navigate, isRecoveryFlow]);

  const handleSuccess = () => {
    // After successful password reset, redirect to home
    setIsRecoveryFlow(false);
    navigate('/');
  };

  const handleClose = () => {
    setShowModal(false);
    setIsRecoveryFlow(false);
    navigate('/');
  };

  // Show loading state while auth is initializing
  if (isLoading && !isRecoveryFlow) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <ResetPasswordModal 
        isOpen={showModal} 
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default ResetPassword;