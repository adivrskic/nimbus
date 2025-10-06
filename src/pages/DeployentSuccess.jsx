// src/pages/DeploymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function DeploymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [deploymentUrl, setDeploymentUrl] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      handleDeployment(sessionId);
    }
  }, [searchParams]);

  const handleDeployment = async (sessionId) => {
    try {
      // Call your deployment edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/deploy-site`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionId,
            // Include deployment data stored in Stripe metadata
          })
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setDeploymentUrl(result.url);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="success-page">
      {status === 'processing' && <p>Deploying your site...</p>}
      {status === 'success' && (
        <>
          <h1>Deployment Successful!</h1>
          <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
            Visit your site
          </a>
        </>
      )}
      {status === 'error' && <p>Deployment failed. Please contact support.</p>}
    </div>
  );
}