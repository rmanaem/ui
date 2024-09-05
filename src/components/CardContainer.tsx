import { useState, useMemo } from 'react';
import { Typography, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { VariantType } from 'notistack';
import RepoCard from './RepoCard';
import NBDialog from './NBDialog';
import Instructions from './Instructions';
import { RepoInfo } from '../utils/types';

function CardContainer({
  repos,
  nameFilters,
  statusFilters,
  onSomeEvent,
}: {
  repos: RepoInfo[];
  nameFilters: string[];
  statusFilters: string[];
  onSomeEvent: (error: string, variant: VariantType) => void;
}) {
  const [openDialog, setOpenDialog] = useState(false);

  // Memoized function to filter repositories
  const filteredRepos = useMemo(
    () =>
      repos.filter((repo) => {
        // Check if the repo name matches any of the name filters
        const nameMatch = nameFilters.length === 0 || nameFilters.includes(repo.name);

        // Check if the repo matches the status filters
        const statusMatch = statusFilters.every((filter) => {
          switch (filter) {
            case 'has participants.tsv':
              return repo.tsv_exists;
            case 'has participants.json':
              return repo.json_exists;
            case 'not annotated':
              return !repo.annotated;
            default:
              return true;
          }
        });

        return nameMatch && statusMatch;
      }),
    [repos, nameFilters, statusFilters]
  );

  return (
    <div className="grid grid-rows-1">
      <div className="grid grid-cols-2 items-center justify-items-center">
        <div className="justify-self-start">
          <IconButton component="button" color="primary" onClick={() => setOpenDialog(true)}>
            <HelpIcon fontSize="medium" />
          </IconButton>
          <NBDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            title="How to download, annotate, and upload OpenNeuro datasets"
            content={<Instructions />}
          />
        </div>
        <div className="justify-self-end">
          <Typography variant="body1">
            Number of available repositories: {filteredRepos.length}
          </Typography>
        </div>
      </div>
      <div className="h-[72vh] space-y-4 overflow-y-auto">
        {filteredRepos.map((repo) => (
          <RepoCard
            key={repo.name}
            repoName={repo.name}
            tsvExists={repo.tsv_exists}
            jsonExists={repo.json_exists}
            annotated={repo.annotated}
            onSomeEvent={onSomeEvent}
          />
        ))}
      </div>
    </div>
  );
}

export default CardContainer;
