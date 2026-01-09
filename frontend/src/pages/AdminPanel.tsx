import { useState, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import api from '../api/axios';

interface AWSConfig {
  accountName: string;
  accessKey: string;
  secretKey: string;
  region: string;
}

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const config: AWSConfig = {
      accountName: formData.get('name') as string,
      accessKey: formData.get('access') as string,
      secretKey: formData.get('secret') as string,
      region: formData.get('region') as string
    };

    try {
      await api.post('/admin/aws', config);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError('Failed to save AWS configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>AWS Configuration</Typography>
      
      {success && <Alert severity="success" sx={{ mb: 2 }}>Configuration saved successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <TextField 
          name="name" 
          label="Account Name" 
          fullWidth 
          required 
          sx={{ mb: 2 }}
        />
        <TextField 
          name="access" 
          label="Access Key" 
          fullWidth 
          required 
          sx={{ mb: 2 }}
        />
        <TextField 
          name="secret" 
          label="Secret Key" 
          type="password"
          fullWidth 
          required 
          sx={{ mb: 2 }}
        />
        <TextField 
          name="region" 
          label="Region" 
          fullWidth 
          required 
          sx={{ mb: 2 }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </form>
    </Container>
  );
}