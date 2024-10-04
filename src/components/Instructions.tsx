import DialogContentText from '@mui/material/DialogContentText';

function instructions() {
  return (
    <DialogContentText>
      Please follow the steps below
      <ol>
        <li>Find the repository for the dataset you&apos;d like to work on</li>
        <ul>
          <li>
            You can filter through the datasets using the name or status dataset and availability of
            the files
          </li>
        </ul>
        <li>Download the participant.tsv and/or the participants.json files</li>
        <ul>
          <li>You can do so by simply clicking on them in the repository card</li>
        </ul>
        <li>
          Once you have the files downloaded locally, head over to the{' '}
          <a href="https://annotate.neurobagel.org/" target="_blank" rel="noopener noreferrer">
            Neurobagel Annotation tool
          </a>
        </li>
        <ul>
          <li>
            You can find the instructions on how to use the tool{' '}
            <a
              href="https://neurobagel.org/annotation_tool/#annotation-workflow"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
          </li>
        </ul>
        <li>
          Once you&apos;re done annotating the dataset, use the upload button for your dataset,
          enter your information in the form, upload your newly annotated participant.json file, and
          submit
        </li>
      </ol>
    </DialogContentText>
  );
}

export default instructions;
