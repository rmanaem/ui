import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface NBDialogProps {
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  title: string;
}

function NBDialog({ open, onClose, title, content }: NBDialogProps) {
  const theme = useTheme();
  const isSmallViewport = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      fullScreen={isSmallViewport}
      open={open}
      onClose={onClose}
      maxWidth="lg"
      data-cy="instruction-dialog"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NBDialog;
