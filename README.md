<div align="center">

# OpenNeuro uploader User Interface

<div>
    <a href="https://github.com/neurobagel/ui/actions/workflows/tests.yaml">
        <img src="https://img.shields.io/github/actions/workflow/status/neurobagel/ui/checks.yaml?color=BDB76B&label=checks&style=flat-square" alt="Checks">
    </a>
    <a href="https://github.com/neurobagel/ui/actions/workflows/test.yaml">
        <img src="https://img.shields.io/github/actions/workflow/status/neurobagel/ui/tests.yaml?color=8FBC8F&label=e2e test&style=flat-square" alt="tests">
    </a>
    <a href="https://nodejs.org/en//">
        <img src="https://img.shields.io/badge/node-20.9-CD5C5C?style=flat-square" alt="Node">
    <a href="LICENSE">
        <img src="https://img.shields.io/github/license/neurobagel/ui?color=4682B4&style=flat-square" alt="GitHub license">
    </a>
</div>
<br>

This is a React application, developed in [TypeScript](https://www.typescriptlang.org/) using a variety of tools including [Vite](https://vitejs.dev/), [Cypress](https://www.cypress.io/), and [MUI](https://mui.com/).

[Quickstart](#quickstart) |
[Testing](#testing) |
[License](#license)

</div>

## Quickstart

### Clone the repo

```bash
git clone https://github.com/neurobagel/ui.git
```

### Set the environment variables

Create a file called `.env` in the root of the repository to store the environment variables used by the app.

| Environment variable      | Type   | Required | Default value if not set | Example                |
| ------------------------- | ------ | -------- | ------------------------ | ---------------------- |
| NB_OPENNEURO_UPLOADER_API | string | Yes      | -                        | http://127.0.0.1:8000/ |
| NB_USERNAME               | string | Yes      | -                        | admin                  |
| NB_PASSWORD               | string | Yes      | -                        | admin                  |

#### `NB_OPENNEURO_UPLOADER_API`

OpenNeuro uploader API URL that the tool uses to send requests to upload the file.

#### `NB_USERNAME` and `NB_PASSWORD`

Username and password used by the OpenNeuro uploader API.

### Install dependencies

To install the tool directly, you'll need [node package manager (npm)](https://www.npmjs.com/) and [Node.js](https://nodejs.org/en/).
You can find the instructions on installing npm and node in the official [documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Once you have npm and node installed, you'll need to install the dependencies outlined in the package.json file.
You can do so by running the following command:

```bash
npm install
```

To launch the tool in developer mode run the following command:

```bash
npm run dev
```

You can also build and then run the tool from ([production](https://vitejs.dev/guide/build)) build of the application by running the following command:

```bash
npm run build && npm run preview
```

You can verify the tool is running by watching for the` info messages from Vite regarding environment, rendering, and what port the tool is running on in your terminal.

## Testing

The tool utilizes [Cypress](https://www.cypress.io/) framework for testing.

To run the tests execute the following command:

```bash
npx cypress open
```

## License

This tool is released under the terms of the [MIT License](LICENSE)
