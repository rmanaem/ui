import { memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

const ORGURL = 'https://github.com/OpenNeuroDatasets-JSONLD/';
const DOWNLOADURL = 'https://raw.githubusercontent.com/OpenNeuroDatasets-JSONLD/';

const RepoCard = memo(
  ({
    repoName,
    tsvExists,
    jsonExists,
    annotated,
  }: {
    repoName: string;
    tsvExists: boolean;
    jsonExists: boolean;
    annotated: boolean;
  }) => {
    // Function to handle downloading the participants.tsv file
    async function handleDownload(file: string) {
      const url = `${DOWNLOADURL}${repoName}/master/${file}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute('download', file);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        if (downloadLink.parentNode) {
          downloadLink.parentNode.removeChild(downloadLink);
        }
      } catch (error) {
        console.error('Failed to download file:', error);
      }
    }

    return (
      <Card data-cy={`card-${repoName}`}>
        <CardContent>
          <div className="grid grid-cols-4 items-center justify-items-center">
            <Typography variant="h5">
              <a href={`${ORGURL}${repoName}`} target="_blank" rel="noopener noreferrer">
                {repoName}
              </a>
            </Typography>
            <div>
              <Typography variant="subtitle2">
                {tsvExists ? (
                  <Button onClick={() => handleDownload('participants.tsv')}>
                    Participants.tsv
                  </Button>
                ) : (
                  'Participants.tsv'
                )}
              </Typography>
              {tsvExists ? (
                <CheckCircleSharpIcon color="success" />
              ) : (
                <CancelSharpIcon color="error" />
              )}
            </div>
            <div>
              <Typography variant="subtitle2">
                {tsvExists ? (
                  <Button href="#" onClick={() => handleDownload('participants.json')}>
                    Participants.json
                  </Button>
                ) : (
                  'Participants.json'
                )}
              </Typography>
              {jsonExists ? (
                <CheckCircleSharpIcon color="success" />
              ) : (
                <CancelSharpIcon color="error" />
              )}
            </div>
            <div>
              <Typography variant="subtitle2">Annotated</Typography>
              {annotated ? (
                <CheckCircleSharpIcon color="success" />
              ) : (
                <CancelSharpIcon color="error" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

export default RepoCard;
