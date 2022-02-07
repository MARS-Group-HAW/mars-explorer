
# MARS-Explorer

An application intended to simplify the first steps into the subject of multi-agent simulation and the MARS framework.


## Prerequisites

- [Node.js](https://nodejs.org/en/) (Version >= 14)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- .NET SDK (for running simulations and validating code in the application)
## Run Locally

Clone the project

```bash
  git clone https://git.haw-hamburg.de/mars/life.git
```

Go to the project directory

```bash
  cd mars-life/Explorer
```

Install dependencies

```bash
  yarn install
```

Start the application

```bash
  yarn start
```

> **IMPORTANT**: 
> Only the files within `app/` will be live reloaded.
> Changes to other files (e.g. in `/main`, `/shared`, ...) won't have an effect until the application has been restarted.
> 

## Running Tests

To run tests, run the following command

```bash
  yarn test
```


## Build

To build this project run

```bash
  yarn make
```

This will make distributables for your application.
It builds for the current OS by default.
Afterwards, the distributable files can be found in `out/make`.

If you want to build it for another OS, have a look at the documentation of [electron-forge](https://git.haw-hamburg.de/mars/life.git).


## Tech Stack

#### Main

- [Electron](https://www.electronjs.org/) (Fundamental Framework for X-Platform development, V13)
- [Electron-Forge](https://www.electronforge.io/) (Tool for creating, publishing, and installing Electron applications)
- [Electron-Log](https://www.npmjs.com/package/electron-log) (Simple Logging Library)
- [Omnisharp-Roslyn](https://github.com/OmniSharp/omnisharp-roslyn) (C# Languageserver, will be downloaded for your current OS by script after running `yarn install`)

#### Renderer
- [React](https://reactjs.org/) (Fundamental UI-Framework)
- [React-use](https://github.com/streamich/react-use) (Collection of Hooks)
- [Material UI](https://v4.mui.com/) (UI-Components, V4)
- [Redux](https://redux.js.org/) / [Redux-Toolkit](https://redux-toolkit.js.org/) (Global state management / React-Bindings)
- [Chart.js](https://www.chartjs.org/) / [React-ChartJS-2](https://github.com/reactchartjs/react-chartjs-2) (Charting-Library / React-Bindings)
- [Formik](https://formik.org/) / [yup](https://github.com/jquense/yup) (Easier Forms, Validation)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) (Code Editor)
- [Monaco-Languageclient](https://github.com/TypeFox/monaco-languageclient) (Languageclient to communicate with Languageserver, new version released as `@codingame/monaco-languageclient`, see [here](https://github.com/TypeFox/monaco-languageclient/issues/295#issuecomment-940756215))

#### Others
- [Typescript](https://www.typescriptlang.org/) (JavaScript with Typings)
- [Jest](https://jestjs.io/) (Testing Library)
## Lessons Learned

#### Complex state should be simplified by using a reducer

Any state that has multiple values should be moved to a reducer function.
In simple terms, a reducer is a function that takes a state and an action as an argument and returns a new state.
A more detailed explanation can be seen [here](https://www.robinwieruch.de/javascript-reducer/) and [here](https://reactjs.org/docs/hooks-reference.html#usereducer).

During the development it became apparent that a state in the UI can become very complex (e.g. open dialog as soon as data is available, close, reset data, ...) and thus very difficult to understand.
The introduction of a reducer has consistently resulted in a well-organized state and comprehensible logic.
Furthermore, the logic can be decoupled from the component, which greatly simplifies testing by allowing both to be tested in isolation.

At the beginning of the development, the logic was split up by implementing many small-scale hooks.
However, experience has shown that these can become very confusing in combination.
Therefore, these hooks should be gradually migrated to Reducers in the future.


#### Using a Reducer does not imply using the global store

It is important to distinguish between a global state using Redux and a local reducer.
In some cases, a certain state must be shared with other components that are not directly accessible.
In this case it makes sense to use the functionality of Redux to store this state globally.
In contrast, there are also cases where a complex state needs to be simplified and shared with components on a local level.
In this case it is sufficient to introduce a local reducer.


#### Use Logs to debug multiple processes
Since several processes interact within the application, debugging with common tools is difficult.
To find out how the processes interact with each other, the logs have proven to be extremely helpful.
## FAQ

#### Where are the logs located?

- MacOS: `~/Library/Logs/MARS-Explorer/`
- Linux: `~/.config/MARS-Explorer/logs/`
- Windows: `%USERPROFILE%\AppData\Roaming\MARS-Explorer\logs\`

Different logs are created depending on the process. 
In addition, logs that are created during development are marked with `.dev.log`.

#### What are the various logs for?

- `ipc`: Logs communication from the renderer to the main process
- `lsp-client`: Logs communication from the client to the languageserver
- `lsp-server`: Logs communication from the server to the languageclient
- `main`: Logs output of main process
- `renderer`: Logs output of the renderer process
