import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

interface FileListProps {
  files: string[];
  selectedFile: string;
  onSelect: (file: string) => void;
}

export default function FileList({ files, selectedFile, onSelect }: FileListProps) {
  if (files.length === 0) {
    return <Typography variant="body2" color="text.secondary">No files found</Typography>;
  }

  return (
    <List>
      {files.map((file) => (
        <ListItem key={file} disablePadding>
          <ListItemButton 
            selected={selectedFile === file}
            onClick={() => onSelect(file)}
          >
            <ListItemText primary={file} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}