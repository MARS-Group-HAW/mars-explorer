import * as React from "react";
import { SharedModelsProvider } from "./hooks/use-shared-models";
import ModelerContainer from "./components/modeler-container";

function Modeler() {
  return (
    <SharedModelsProvider>
      <ModelerContainer />
    </SharedModelsProvider>
  );
}

export default Modeler;
