import { useState } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import BucketSelector from '../components/BucketSelector';
import FileList from '../components/FileList';
import TransferForm from '../components/TransferForm';
import TransferStatus from '../components/TransferStatus';
import { listFiles } from '../api/s3Api';

type TransferState = 'idle' | 'transferring' | 'completed' | 'error';

export default function Dashboard() {
  const [bucket, setBucket] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transferStatus, setTransferStatus] = useState<TransferState>('idle');

  const loadFiles = async () => {
    if (!bucket) {
      setError('Please select a bucket first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const fileList = await listFiles(bucket);
      setFiles(fileList);
    } catch (err) {
      setError('Failed to load files from bucket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>S3 File Transfer Dashboard</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ mb: 3 }}>
        <BucketSelector value={bucket} onChange={setBucket} />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <button onClick={loadFiles} disabled={loading || !bucket}>
          {loading ? 'Loading...' : 'Load Files'}
        </button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <FileList files={files} selectedFile={selectedFile} onSelect={setSelectedFile} />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TransferForm 
          sourceBucket={bucket} 
          destinationBucket="destination-bucket" 
          fileKey={selectedFile}
          onStatusChange={setTransferStatus}
        />
      </Box>
      
      <TransferStatus status={transferStatus} />
    </Container>
  );
}