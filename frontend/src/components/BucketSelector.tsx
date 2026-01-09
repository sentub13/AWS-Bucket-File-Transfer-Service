import { TextField } from '@mui/material';

interface BucketSelectorProps {
  value: string;
  onChange: (bucket: string) => void;
}

export default function BucketSelector({ value, onChange }: BucketSelectorProps) {
  return (
    <TextField 
      label="Bucket Name" 
      value={value}
      onChange={e => onChange(e.target.value)}
      fullWidth
      required
    />
  );
}