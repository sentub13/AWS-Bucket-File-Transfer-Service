import { Box, Typography, LinearProgress } from '@mui/material';

interface TransferStatusProps {
  status: 'idle' | 'transferring' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export default function TransferStatus({ status, progress = 0, message }: TransferStatusProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Transfer Status: {status}</Typography>
      {status === 'transferring' && (
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
      )}
      {message && (
        <Typography variant="body2" sx={{ mt: 1 }}>{message}</Typography>
      )}
    </Box>
  );
}