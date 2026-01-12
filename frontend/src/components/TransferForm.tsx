import { useState, useEffect } from 'react';
import { Button, Alert } from '@mui/material';
import { startTransfer, getTransferStatus } from '../api/transferApi';

interface TransferFormProps {
  sourceBucket: string;
  destinationBucket: string;
  fileKey: string;
  onStatusChange: (status: 'idle' | 'transferring' | 'completed' | 'error') => void;
}

export default function TransferForm({ sourceBucket, destinationBucket, fileKey, onStatusChange }: TransferFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (jobId) {
      interval = setInterval(async () => {
        try {
          const status = await getTransferStatus(jobId);
          if (status === 'COMPLETED') {
            onStatusChange('completed');
            setJobId(null);
          } else if (status === 'FAILED') {
            onStatusChange('error');
            setError('Transfer failed');
            setJobId(null);
          }
        } catch (err) {
          console.error('Failed to get transfer status:', err);
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, onStatusChange]);

  const handleTransfer = async () => {
    if (!sourceBucket || !destinationBucket || !fileKey) {
      setError('Please select source bucket, destination bucket, and file');
      return;
    }

    setLoading(true);
    setError('');
    onStatusChange('transferring');

    try {
      const transferJobId = await startTransfer({
        sourceBucket,
        destinationBucket,
        fileKey
      });
      setJobId(transferJobId);
    } catch (err) {
      setError('Transfer failed to start. Please try again.');
      onStatusChange('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button 
        variant="contained" 
        onClick={handleTransfer}
        disabled={loading || !sourceBucket || !destinationBucket || !fileKey || !!jobId}
        fullWidth
      >
        {loading ? 'Starting Transfer...' : jobId ? 'Transfer in Progress...' : 'Start Transfer'}
      </Button>
    </>
  );
}