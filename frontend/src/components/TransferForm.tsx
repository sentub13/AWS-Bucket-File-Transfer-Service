import { useState } from 'react';
import { Button, Alert } from '@mui/material';
import { startTransfer } from '../api/transferApi';

interface TransferFormProps {
  sourceBucket: string;
  destinationBucket: string;
  fileKey: string;
  onStatusChange: (status: 'idle' | 'transferring' | 'completed' | 'error') => void;
}

export default function TransferForm({ sourceBucket, destinationBucket, fileKey, onStatusChange }: TransferFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async () => {
    if (!sourceBucket || !fileKey) {
      setError('Please select a source bucket and file');
      return;
    }

    setLoading(true);
    setError('');
    onStatusChange('transferring');

    try {
      await startTransfer({
        sourceBucket,
        destinationBucket,
        fileKey
      });
      onStatusChange('completed');
    } catch (err) {
      setError('Transfer failed. Please try again.');
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
        disabled={loading || !sourceBucket || !fileKey}
      >
        {loading ? 'Transferring...' : 'Start Transfer'}
      </Button>
    </>
  );
}