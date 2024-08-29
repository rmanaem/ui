import { useState, useRef } from 'react';
import { Tab, Tabs } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import axios from 'axios';
import './App.css';
import Upload from './components/Upload';
import Download from './components/Download';
import { updateURL } from './utils/constants';
import { isErrorWithResponse } from './utils/types';

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [datasetID, setDatasetID] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

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
    <>
      <SnackbarProvider
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={7}
      />
      <Tabs centered value={selectedTab} onChange={handleTabChange}>
        <Tab label="Download" />
        <Tab label="Upload" data-cy="upload-tab" />
      </Tabs>
      {selectedTab === 0 ? (
        <Download />
      ) : (
        <Upload
          onUpdateSelectedRepo={(value) => updateSelectedRepo(value)}
          fileInput={fileInput}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          onHandleSubmit={() => handleSubmit()}
        />
      )}
    </>
  );
}

export default App;
