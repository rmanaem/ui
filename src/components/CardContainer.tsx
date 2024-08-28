import { Typography } from '@mui/material';
import RepoCard from './RepoCard';
import { RepoInfo } from '../utils/types';

function CardContainer({ repos }: { repos: RepoInfo[] }) {
  return (
    <>
      <div className="col-end-5 justify-self-end">
        <Typography variant="body1" data-cy="summary-stats">
          {`Last updated:`}
        </Typography>
      </div>
      <div className="col-span-4 h-[70vh] space-y-4 overflow-y-auto">
        {repos.map((item) => (
          <RepoCard
            repoName={item.name}
            tsvExists={item.tsv_exists}
            jsonExists={item.json_exists}
            annotated={item.annotated}
          />
        ))}
      </div>
    </>
  );
}

export default CardContainer;
