import { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import { Autocomplete, TextField, Button, Typography } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './App.css';

function App() {
  // const [repos, setRepos] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // useEffect(() => {
  //   async function getRepos() {
  //     const octokit = new Octokit({
  //       auth: import.meta.env.NB_GITHUB_TOKEN,
  //     });

  //     const response = await octokit.paginate(octokit.rest.repos.listForOrg, {
  //         org: "OpenNeuroDatasets-JSONLD",
  //         per_page: 100
  //     });

  //     return response.slice(1).map((repo) => repo.name);
  //   }

  //   getRepos().then((repoNames) => {
  //     if (repoNames.length !== 0) {
  //       setRepos(repoNames);
  //     }
  //   });

  // }, []);

  function updateSelectedRepo(value: string | null) {
    if (value !== null) {
      setSelectedRepo(value);
    } else {
      setSelectedRepo('');
    }
  }

  function handleFileChange (event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  function handleButtonClick() {
    const fileInput = document.getElementById('file-upload');
    fileInput?.click();
  };

  async function handleSubmit() {
    if (selectedRepo === '') {
      enqueueSnackbar('Error: Please enter a dataset id.', { variant: 'error' });
    } else if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async (readEvent) => {
        const content = readEvent.target?.result;
        if (typeof content === 'string') {
          try {
            const response = await axios.put(
              `http://localhost:8000/openneuro/upload?dataset_id=${selectedRepo}`,
              content,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                auth: {
                  username: 'admin',
                  password: 'admin',
                }
              }
            );
            enqueueSnackbar(`Success: ${response.data.message}`, { variant: 'success' });
          } catch (error : any) {
            console.log(error);
            enqueueSnackbar(`Error: ${error.response.data.error}`, { variant: 'error' });
          }
        }
      };
      reader.readAsText(uploadedFile);
    } else {
      enqueueSnackbar('Error: Please select a file to upload.', { variant: 'error' });
    }
  };

  return (
    <>
      {/* <Autocomplete
      options={repos}
      renderInput={(params) => <TextField {...params} label="Dataset ID" placeholder='Select a dataset id' className='w-full' />}
      onChange = {(_, value) => {updateSelectedRepo(value)}}
    /> */}
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
        <input
          accept="*/*"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button onClick={handleButtonClick} startIcon={<CloudUploadIcon />} variant="contained">
            Upload File
          </Button>
        </label>
        <Typography>{uploadedFile && `File uploaded: ${uploadedFile.name}`}</Typography>

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default App;
