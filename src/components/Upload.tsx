import { TextField, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  }

  function handleUpload() {
    fileInput.current?.click();
  }
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-3">
      <TextField
        data-cy="dataset-id-field"
        label="Dataset ID"
        placeholder="dataset id"
        required
        type="text"
        onChange={(event) => onUpdateSelectedRepo(event.target.value)}
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

      <Button data-cy="submit-button" variant="contained" onClick={() => onHandleSubmit()}>
        Submit
      </Button>
    </div>
  );
}

export default Upload;
