import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toolbar, Typography, IconButton, Badge, Tooltip } from '@mui/material';
import GitHub from '@mui/icons-material/GitHub';
import Article from '@mui/icons-material/Article';

function Navbar() {
  const [latestReleaseTag, setLatestReleaseTag] = useState('');

  useEffect(() => {
    const GHApiURL = 'https://api.github.com/repos/neurobagel/ui/releases/latest';
    axios
      .get(GHApiURL)
      .then((response) => {
        const { data } = response;
        setLatestReleaseTag(data.tag_name);
      })
      .catch(() => {
        setLatestReleaseTag('beta');
      });
  }, []);

  return (
    <Toolbar className="my-4" data-cy="navbar">
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          <img
            src="https://raw.githubusercontent.com/neurobagel/documentation/main/docs/imgs/logo/neurobagel_logo.png"
            alt="Logo"
            height="60"
          />
          <div className="ml-4">
            <Badge badgeContent={latestReleaseTag}>
              <Typography variant="h5">Neurobagel OpenNeuro Utility</Typography>
            </Badge>
            <Typography className="text-gray-500">
              Download and upload OpenNeuro datasets within Neurobagel ecosystem
            </Typography>
          </div>
        </div>
        <div className="flex">
          <Tooltip title="Documentation">
            <IconButton size="small" href="https://neurobagel.org/query_tool/" target="_blank">
              <Article />
            </IconButton>
          </Tooltip>
          <IconButton href="https://github.com/neurobagel/react-query-tool/" target="_blank">
            <GitHub />
          </IconButton>
        </div>
      </div>
    </Toolbar>
  );
}

export default Navbar;
