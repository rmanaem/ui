import React from 'react';
import RepoCard from './RepoCard';
import { RepoInfo } from '../utils/types';

function CardContainer({
  repos,
  nameFilters,
  statusFilters,
}: {
  repos: RepoInfo[];
  nameFilters: string[];
  statusFilters: string[];
}) {
  // Memoized function to filter repositories
  const filteredRepos = React.useMemo(() => {
    return repos.filter((repo) => {
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
    });
  }, [repos, nameFilters, statusFilters]); // Only recompute when these dependencies change

  return (
    <div className="h-[72vh] space-y-4 overflow-y-auto">
      {filteredRepos.map((repo) => (
        <RepoCard
          key={repo.name}
          repoName={repo.name}
          tsvExists={repo.tsv_exists}
          jsonExists={repo.json_exists}
          annotated={repo.annotated}
        />
      ))}
    </div>
  );
}

export default CardContainer;
