import { useState, useRef } from 'react';
import { TextField, Button, Typography, Alert, IconButton, Collapse } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';
import { VariantType } from 'notistack';
import { updateURL } from '../utils/constants';
import { isErrorWithResponse } from '../utils/types';

function UploadForm({
  repoName,
  onSomeEvent,
}: {
  repoName: string;
  onSomeEvent: (message: string, variant: VariantType) => void;
}) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [showAlert, setShowAlert] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  }

  function handleUpload() {
    fileInput.current?.click();
  }

  async function handleSubmit() {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async (readEvent) => {
        const content = readEvent.target?.result;
        if (typeof content === 'string') {
          try {
            const response = await axios.put(`${updateURL}=${repoName}`, content, {
              headers: {
                'Content-Type': 'application/json',
              },
              auth: {
                username: import.meta.env.NB_USERNAME,
                password: import.meta.env.NB_PASSWORD,
              },
            });
            onSomeEvent(`Success: ${response.data.message}`, 'success');
          } catch (error: unknown) {
            if (isErrorWithResponse(error)) {
              onSomeEvent(`Error: ${error.response.data.error}`, 'error');
            } else {
              onSomeEvent(`Error: ${error}`, 'error');
            }
          }
        }
      };
      reader.readAsText(uploadedFile);
    } else {
      onSomeEvent('Error: Please select a file to upload.', 'error');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="flex w-full items-center justify-center">
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

      <TextField className="w-full" label="User full name" placeholder="John Doe" required />
      <TextField className="w-full" label="Email" placeholder="john.doe@noreply.com" required />
      <TextField className="w-full" label="Affiliation" placeholder="McGill University" />
      <TextField className="w-full" label="GitHub username" placeholder="doejo" />
      <TextField
        className="w-full"
        label="Summary of changes to the data dictionary"
        placeholder={`- Added complete annotation for age and sex columns\n- Added partial annotation for diagnosis and assessment tool columns`}
        multiline
        minRows={10}
        required
      />

      <div className="flex w-full items-center justify-between">
        <TextField
          data-cy="repo-name-field"
          label="Repository Name"
          defaultValue={repoName}
          type="text"
          className="flex-grow"
          InputProps={{
            readOnly: true, // Set readOnly attribute
          }}
          variant="filled"
        />

        <label htmlFor="file-upload" className="ml-4">
          <input
            ref={fileInput}
            accept="*/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            data-cy="upload-file-button"
            onClick={() => handleUpload()}
            startIcon={<CloudUploadIcon />}
            variant="contained"
          >
            Upload File
          </Button>
        </label>
      </div>

      <Typography>{uploadedFile && `File uploaded: ${uploadedFile.name}`}</Typography>
      <Button data-cy="submit-button" variant="contained" onClick={() => handleSubmit()}>
        Submit
      </Button>
    </div>
  );
}

export default UploadForm;
