# Example Models

Within the mars-explorer the user can view and also copy the projects that are located here.

## Requirements
Since these projects often represent a starting point for students, they should be compilable in any case. To ensure this, the following requirements apply to the example projects:
- The models (`*.cs` files) should be located at the top level of the directory (other files can be nested)
- The namespace of the model files must be the same as the project name, no additions
- Your models framework version of `Mars.Life.Simulations` must match the version used in the *MARS-Explorer* (you can find the
  version used by this app at the top of `Explorer/src/electron/ipc-main-handler.ts`
  -> `const MARS_LIFE_VERSION = "..."`)
- The project should preferably build with `netcoreapp3.1`
- Your directory must contain a `config.json` file at the same level as the models
- This config.json should:
  - not use `globals.console: true` because it's currently bugged, use `globals.reportProgress: true` instead
- Your main file (usually `Program.cs`) must read the contents of the `config.json` and pass it to the `Start(...)`
  method
- Your project should contain a `README.md` to explain the use case of that project

```
// use config.json like this
var file = File.ReadAllText("config.json");
var config = SimulationConfig.Deserialize(file);
// ...
var starter = SimulationStarter.Start(description, config);
```

