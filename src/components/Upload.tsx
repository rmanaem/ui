import { useState } from 'react';
import { TextField, Button, Typography, Alert, IconButton, Collapse } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpIcon from '@mui/icons-material/Help';

function Upload({
  fileInput,
  uploadedFile,
  setUploadedFile,
  onUpdateSelectedRepo,
  onHandleSubmit,
}: {
  onUpdateSelectedRepo: (value: string | null) => void;
  fileInput: React.RefObject<HTMLInputElement>;
  uploadedFile: File | null;
  setUploadedFile: (value: File | null) => void;
  onHandleSubmit: () => void;
}) {
  const [showAlert, setShowAlert] = useState(true);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  }

  function handleUpload() {
    fileInput.current?.click();
  }

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-3">
      <div className="flex w-1/2 items-center justify-center">
        <IconButton
          component="button"
          color="primary"
          onClick={() => setShowAlert((prev) => !prev)}
        >
          <HelpIcon fontSize="medium" />
        </IconButton>
        <Collapse in={showAlert} className="ml-2 flex-grow">
          <Alert severity="info">
            Please fill in the required fields *, upload the data dictionary, and click submit.
          </Alert>
        </Collapse>
      </div>

      <TextField className="w-1/2" label="User full name" required />
      <TextField className="w-1/2" label="Email" required />
      <TextField className="w-1/2" label="GitHub username" />
      <TextField
        className="w-1/2"
        label="Summary of changes to the data dictionary"
        placeholder={`- Added complete annotation for age and sex columns\n- Added partial annotation for diagnosis and assessment tool columns`}
        multiline
        minRows={10}
        required
      />

      <div className="flex w-1/2 items-center justify-between">
        <TextField
          data-cy="dataset-id-field"
          label="Dataset ID"
          placeholder="dataset id"
          required
          type="text"
          onChange={(event) => onUpdateSelectedRepo(event.target.value)}
          className="flex-grow"
        />

        <label htmlFor="file-upload" className="ml-4">
          <input
            ref={fileInput}
            accept="*/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={() => handleFileChange}
          />
          <Button
            data-cy="upload-file-button"
            onClick={() => handleUpload}
            startIcon={<CloudUploadIcon />}
            variant="contained"
          >
            Upload File
          </Button>
        </label>
      </div>

      <Typography>{uploadedFile && `File uploaded: ${uploadedFile.name}`}</Typography>
      <Button data-cy="submit-button" variant="contained" onClick={onHandleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default Upload;
