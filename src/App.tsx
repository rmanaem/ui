import { useState, useRef } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './App.css';
import { updateURL } from './utils/constants';
import { isErrorWithResponse } from './utils/type';

function App() {
  const [datasetID, setDatasetID] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function updateSelectedRepo(value: string | null) {
    setDatasetID(value ?? '');
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  }

  function handleUpload() {
    fileInput.current?.click();
  }

  async function handleSubmit() {
    if (datasetID === '') {
      enqueueSnackbar('Error: Please enter a dataset id.', { variant: 'error' });
    } else if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async (readEvent) => {
        const content = readEvent.target?.result;
        if (typeof content === 'string') {
          try {
            const response = await axios.put(`${updateURL}=${datasetID}`, content, {
              headers: {
                'Content-Type': 'application/json',
              },
              auth: {
                username: import.meta.env.NB_USERNAME,
                password: import.meta.env.NB_PASSWORD,
              },
            });
            enqueueSnackbar(`Success: ${response.data.message}`, { variant: 'success' });
          } catch (error: unknown) {
            if (isErrorWithResponse(error)) {
              enqueueSnackbar(`Error: ${error.response.data.error}`, { variant: 'error' });
            } else {
              enqueueSnackbar(`Error: ${error}`, { variant: 'error' });
            }
          }
        }
      };
      reader.readAsText(uploadedFile);
    } else {
      enqueueSnackbar('Error: Please select a file to upload.', { variant: 'error' });
    }
  }

  return (
    <>
      <SnackbarProvider
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={7}
      />
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-3">
        <TextField
          data-cy="dataset-id-field"
          label="Dataset ID"
          placeholder="dataset id"
          required
          type="text"
          onChange={(event) => updateSelectedRepo(event.target.value)}
        />
        {/*
         * We have to use a button and an invisible input to trigger the file upload
         * since MUI doesn't have a native file input.
         * Once the button is clicked we click the invisible input through DOM manipulation
         * to trigger the file upload.
         */}
        <label htmlFor="file-upload">
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
        <Typography>{uploadedFile && `File uploaded: ${uploadedFile.name}`}</Typography>

        <Button data-cy="submit-button" variant="contained" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default App;
