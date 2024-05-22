import { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './App.css';
import { updateURL } from './utils/constants';
import { isErrorWithResponse } from './utils/type';

function App() {
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  function updateSelectedRepo(value: string | null) {
    if (value !== null) {
      setSelectedRepo(value);
    } else {
      setSelectedRepo('');
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  }

  function handleUpload() {
    const fileInput = document.getElementById('file-upload');
    fileInput?.click();
  }

  async function handleSubmit() {
    if (selectedRepo === '') {
      enqueueSnackbar('Error: Please enter a dataset id.', { variant: 'error' });
    } else if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async (readEvent) => {
        const content = readEvent.target?.result;
        if (typeof content === 'string') {
          try {
            const response = await axios.put(`${updateURL}=${selectedRepo}`, content, {
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
          label="Dataset ID"
          placeholder="dataset id"
          required
          type="text"
          onChange={(event) => updateSelectedRepo(event.target.value)}
        />

        <label htmlFor="file-upload">
          <input
            accept="*/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            onClick={() => handleUpload()}
            startIcon={<CloudUploadIcon />}
            variant="contained"
          >
            Upload File
          </Button>
        </label>
        <Typography>{uploadedFile && `File uploaded: ${uploadedFile.name}`}</Typography>

        <Button variant="contained" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default App;
