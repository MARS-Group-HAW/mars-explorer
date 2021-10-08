import * as React from "react";
import useAgentsForm from "./use-agents-form.hook";
import MappingsForm from "../mappings-form";
import AgentsEntitiesForm from "../agents-entities-form";

const AgentsForm = () => {
  const { namespace } = useAgentsForm();

  return (
    <MappingsForm>
      <AgentsEntitiesForm namespace={namespace} />
    </MappingsForm>
  );
};

export default AgentsForm;
