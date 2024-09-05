import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import './App.css';
import Download from './components/Download';

import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <SnackbarProvider
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={7}
      />
      <Download onSomeEvent={(message, variant) => enqueueSnackbar(message, { variant })} />
    </>
  );
}

export default App;
