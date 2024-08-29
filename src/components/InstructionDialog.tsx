import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function InstructionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      maxWidth="lg"
      data-cy="instruction-dialog"
    >
      <DialogTitle>How to download, annotate, and upload OpenNeuro datasets</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please follow the steps below
          <ol>
            <li>Find the repository for the dataset you&apos;d like to work on</li>
            <ul>
              <li>
                You can filter through the datasets using the name or status dataset and
                availability of the files
              </li>
            </ul>
            <li>Download the participant.tsv and/or the participants.json files</li>
            <ul>
              <li>You can do so by simply clicking on them in the repository card</li>
            </ul>
            <li>
              Once you have the files downloaded locally, head over to the{' '}
              <a href="https://annotate.neurobagel.org/" target="_blank" rel="noopener noreferrer">
                Neurobagel Annotation tool
              </a>
            </li>
            <ul>
              <li>
                You can find the instructions on how to use the tool{' '}
                <a
                  href="https://neurobagel.org/annotation_tool/#annotation-workflow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
              </li>
            </ul>
            <li>
              Once you&apos;re done annotating the dataset, navigate to the upload tab, enter your
              dataset ID, upload your newly annotated participant.json file, and submit
            </li>
          </ol>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InstructionDialog;
