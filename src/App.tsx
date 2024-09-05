import { useState, useRef } from 'react';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Upload from './components/Upload';
import Download from './components/Download';
import { updateURL } from './utils/constants';
import { isErrorWithResponse } from './utils/types';
import Navbar from './components/Navbar';

function App() {
  const [datasetID, setDatasetID] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function updateSelectedRepo(value: string | null) {
    setDatasetID(value ?? '');
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
    <Router>
      <Navbar />
      <SnackbarProvider
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={7}
      />
      <Routes>
        {/* Redirect base route to /download */}
        <Route path="/" element={<Navigate to="/download" />} />
        {/* Define /download and /upload routes */}
        <Route
          path="/download"
          element={
            <Download onSomeError={(error) => enqueueSnackbar(error, { variant: 'error' })} />
          }
        />
        <Route
          path="/upload"
          element={
            <Upload
              onUpdateSelectedRepo={(value) => updateSelectedRepo(value)}
              fileInput={fileInput}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              onHandleSubmit={() => handleSubmit()}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
