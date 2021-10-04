import * as React from "react";
import useAgentsForm from "./use-agents-form.hook";
import MappingsForm from "../mappings-form";

const AgentsForm = () => {
  const { selectedAgentNamespace } = useAgentsForm();

  return <MappingsForm namespace={selectedAgentNamespace} />;
};

export default AgentsForm;
