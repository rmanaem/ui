import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { VariantType } from 'notistack';
import repos from '../assets/repos.json';
import CardContainer from './CardContainer';

function Download({ onSomeEvent }: { onSomeEvent: (error: string, variant: VariantType) => void }) {
  const statusOptions = [
    'has participants.tsv',
    'has participants.json',
    'not annotated using Neurobagel',
  ];
  const [nameFilters, setNameFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  return (
    <div className="mt-6 space-y-2">
      <div className="mb-4 grid grid-cols-6 space-x-4">
        <div className="col-span-2 col-start-2">
          <Autocomplete
            options={repos.map((item) => item.name)}
            multiple
            value={nameFilters}
            onChange={(_, newValue) => {
              setNameFilters(newValue);
            }}
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                label="Filter by name"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
        </div>
        <div className="col-span-2">
          <Autocomplete
            multiple
            options={statusOptions}
            value={statusFilters}
            onChange={(_, newValue) => {
              setStatusFilters(newValue);
            }}
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                label="Filter by status"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
        </div>
      </div>

      <CardContainer
        repos={repos}
        nameFilters={nameFilters}
        statusFilters={statusFilters}
        onSomeEvent={onSomeEvent}
      />
    </div>
  );
}

export default Download;
