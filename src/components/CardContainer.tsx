import { FixedSizeList } from 'react-window';
import { VariantType } from 'notistack';
import { useMemo, useState } from 'react';
import { Typography, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { RepoInfo } from '../utils/types';
import RepoCard from './RepoCard';
import NBDialog from './NBDialog';
import Instructions from './Instructions';

function VirtualRow({
  style,
  repo,
  onSomeEvent,
}: {
  style: React.CSSProperties;
  repo: RepoInfo;
  onSomeEvent: (error: string, variant: VariantType) => void;
}) {
  return (
    <div style={style}>
      <RepoCard
        key={repo.name}
        repoName={repo.name}
        tsvExists={repo.tsv_exists}
        jsonExists={repo.json_exists}
        annotated={repo.annotated}
        onSomeEvent={onSomeEvent}
      />
    </div>
  );
}

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
        const nameMatch = nameFilters.length === 0 || nameFilters.includes(repo.name);
        const statusMatch = statusFilters.every((filter) => {
          switch (filter) {
            case 'has participants.tsv':
              return repo.tsv_exists;
            case 'has participants.json':
              return repo.json_exists;
            case 'not annotated using Neurobagel':
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
      <div className="overflow-y-auto">
        {/* Using a virtualized list since the list of repos is very large */}
        <FixedSizeList height={1200} itemCount={filteredRepos.length} itemSize={120} width={1275}>
          {({ index, style }) => (
            <VirtualRow style={style} repo={filteredRepos[index]} onSomeEvent={onSomeEvent} />
          )}
        </FixedSizeList>
      </div>
    </div>
  );
}

export default CardContainer;
