import { useState } from 'react';
import { Container, Typography, Box, Alert, Button, TextField, Grid, Paper } from '@mui/material';
import BucketSelector from '../components/BucketSelector';
import FileList from '../components/FileList';
import TransferForm from '../components/TransferForm';
import TransferStatus from '../components/TransferStatus';
import { listFiles, uploadFile, downloadFile } from '../api/s3Api';

type TransferState = 'idle' | 'transferring' | 'completed' | 'error';

export default function Dashboard() {
  const [sourceBucket, setSourceBucket] = useState('');
  const [destBucket, setDestBucket] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transferStatus, setTransferStatus] = useState<TransferState>('idle');
  const [uploadFile_, setUploadFile] = useState<File | null>(null);

  const loadFiles = async () => {
    if (!sourceBucket) {
      setError('Please select a source bucket first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const fileList = await listFiles(sourceBucket);
      setFiles(fileList);
      setSuccess('Files loaded successfully');
    } catch (err) {
      setError('Failed to load files from bucket');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile_ || !sourceBucket) {
      setError('Please select a file and bucket');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await uploadFile(sourceBucket, uploadFile_);
      setSuccess('File uploaded successfully');
      setUploadFile(null);
      loadFiles(); // Refresh file list
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedFile || !sourceBucket) {
      setError('Please select a file to download');
      return;
    }

    try {
      const blob = await downloadFile(sourceBucket, selectedFile);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('File downloaded successfully');
    } catch (err) {
      setError('Failed to download file');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>S3 File Transfer Dashboard</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Source Bucket</Typography>
            <BucketSelector value={sourceBucket} onChange={setSourceBucket} />
            <Button 
              onClick={loadFiles} 
              disabled={loading || !sourceBucket}
              variant="contained"
              sx={{ mt: 2 }}
            >
              {loading ? 'Loading...' : 'Load Files'}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Destination Bucket</Typography>
            <BucketSelector value={destBucket} onChange={setDestBucket} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Upload File</Typography>
            <input 
              type="file" 
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              style={{ marginBottom: '16px' }}
            />
            <Button 
              onClick={handleUpload}
              disabled={loading || !uploadFile_ || !sourceBucket}
              variant="contained"
              fullWidth
            >
              Upload File
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>File Operations</Typography>
            <Button 
              onClick={handleDownload}
              disabled={!selectedFile || !sourceBucket}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            >
              Download Selected File
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Files in {sourceBucket || 'Bucket'}</Typography>
            <FileList files={files} selectedFile={selectedFile} onSelect={setSelectedFile} />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>File Transfer</Typography>
            <TransferForm 
              sourceBucket={sourceBucket} 
              destinationBucket={destBucket} 
              fileKey={selectedFile}
              onStatusChange={setTransferStatus}
            />
            <TransferStatus status={transferStatus} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}