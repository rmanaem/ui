import { memo, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';
import { VariantType } from 'notistack';
import NBDialog from './NBDialog';
import Upload from './Upload';

const ORGURL = 'https://github.com/OpenNeuroDatasets-JSONLD/';
const DOWNLOADURL = 'https://raw.githubusercontent.com/OpenNeuroDatasets-JSONLD/';

const RepoCard = memo(
  ({
    repoName,
    tsvExists,
    jsonExists,
    annotated,
    onSomeEvent,
  }: {
    repoName: string;
    tsvExists: boolean;
    jsonExists: boolean;
    annotated: boolean;
    onSomeEvent: (error: string, variant: VariantType) => void;
  }) => {
    const [openUploadDialog, setUploadDialog] = useState(false);

    function downloadFile(fileBlob: Blob, fileName: string) {
      const blob = new Blob([fileBlob]);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.setAttribute('download', fileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();

      if (downloadLink.parentNode) {
        downloadLink.parentNode.removeChild(downloadLink);
      }
    }
    async function handleDownload(file: string) {
      let url = `${DOWNLOADURL}${repoName}/master/${file}`;
      try {
        // Try to download from the master branch
        const response = await axios.get(url, { responseType: 'blob' });
        downloadFile(response.data, file);
      } catch (error) {
        // Check if the error is a 404 from the master branch and then try main branch
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          try {
            url = `${DOWNLOADURL}${repoName}/main/${file}`;
            const response = await axios.get(url, { responseType: 'blob' });
            downloadFile(response.data, file);
          } catch (errorMain) {
            onSomeEvent(`Failed to download file from main branch: ${errorMain}`, 'error');
          }
        } else {
          onSomeEvent(`Failed to download file: ${error}`, 'error');
        }
      }
    }

    return (
      <>
        <Card data-cy={`card-${repoName}`}>
          <CardContent>
            <div className="grid grid-cols-4 items-center justify-items-center">
              <div>
                <Typography variant="h5">
                  <Button
                    className="text-xl"
                    href={`${ORGURL}${repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repoName}
                  </Button>
                </Typography>
                <Button endIcon={<UploadIcon />} onClick={() => setUploadDialog(true)}>
                  Upload
                </Button>
              </div>
              <div>
                <Typography variant="subtitle2">
                  {tsvExists ? (
                    <Button
                      href={`${ORGURL}${repoName}/tree/master/participants.tsv`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Participants.tsv
                    </Button>
                  ) : (
                    <Button disabled>Participants.tsv</Button>
                  )}
                </Typography>
                {tsvExists ? (
                  <div className="space-x-1">
                    <CheckCircleSharpIcon color="success" />
                    <DownloadIcon
                      onClick={() => handleDownload('participants.tsv')}
                      color="primary"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ) : (
                  <div className="space-x-1">
                    <CancelSharpIcon color="error" />
                    <DownloadIcon color="disabled" />
                  </div>
                )}
              </div>
              <div>
                <Typography variant="subtitle2">
                  {jsonExists ? (
                    <Button
                      href={`${ORGURL}${repoName}/tree/master/participants.json`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Participants.json
                    </Button>
                  ) : (
                    <Button disabled>Participants.json</Button>
                  )}
                </Typography>
                {jsonExists ? (
                  <div className="space-x-1">
                    <CheckCircleSharpIcon color="success" />
                    <DownloadIcon
                      onClick={() => handleDownload('participants.json')}
                      color="primary"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ) : (
                  <div className="space-x-1">
                    <CancelSharpIcon color="error" />
                    <DownloadIcon color="disabled" />
                  </div>
                )}
              </div>
              <div>
                <Typography variant="subtitle2">
                  {annotated ? (
                    <Button
                      href={`https://github.com/neurobagel/openneuro-annotations/tree/main/${repoName}.jsonld`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Annotated
                    </Button>
                  ) : (
                    <Button disabled>Annotated</Button>
                  )}
                </Typography>
                {annotated ? (
                  <CheckCircleSharpIcon color="success" />
                ) : (
                  <CancelSharpIcon color="error" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <NBDialog
          open={openUploadDialog}
          onClose={() => setUploadDialog(false)}
          title={`Uploading the data dictionary for ${repoName}`}
          content={<Upload repoName={repoName} onSomeEvent={onSomeEvent} />}
        />
      </>
    );
  }
);

export default RepoCard;
