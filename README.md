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

To run the tool, you have two options:

1. Use our docker image
2. Do a manual install from the cloned git repo

but before proceeding with either you need to set the environment variables.

### Mandatory configuration

| Environment variable      | Type   | Required | Default value if not set | Example                |
| ------------------------- | ------ | -------- | ------------------------ | ---------------------- |
| NB_OPENNEURO_UPLOADER_API | string | Yes      | -                        | http://127.0.0.1:8000/ |
| NB_USERNAME               | string | Yes      | -                        | admin                  |
| NB_PASSWORD               | string | Yes      | -                        | admin                  |

#### `NB_OPENNEURO_UPLOADER_API`

OpenNeuro uploader API URL that the tool uses to send requests to upload the file.

#### `NB_USERNAME` and `NB_PASSWORD`

Username and password used by the OpenNeuro uploader API.

#### Set the environment variables

To set environment variables, create a `.env` file in the root directory and add the environment variables there. Your `.env` file would look something like this:

```bash
NB_OPENNEURO_UPLOADER_API=http://upload.neurobagel.org/
NB_USERNAME=admin
NB_PASSWORD=admin
```

:warning: The protocol matters here.
If you wish to use the Neurobagel remote API, ensure your `NB_API_QUERY_URL` uses `https` instead of `http`.

### Docker installation

To obtain tool's docker image, simply run the following command in your terminal:

```bash
docker pull neurobagel/openneuro_uploader_ui:latest
```

This Docker image includes the latest release of the query tool and a minimal http server to serve the static tool.

To launch the tool Docker container and pass in the `.env` file you have created, simply run

```bash
docker run -p 5173:5173 --env-file=.env neurobagel/openneuro_uploader_ui:latest
```

Then you can access the ui at http://localhost:5173

**Note**: the tool is listening on port `5173` inside the docker container,
replace port `5173` by the port you would like to expose to the host.
For example if you'd like to run the tool on port `8000` of your machine you can run the following command:

```bash
docker run -p 8000:5173 --env-file=.env neurobagel/openneuro_uploader_ui:latest
```

### Manual installation

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
