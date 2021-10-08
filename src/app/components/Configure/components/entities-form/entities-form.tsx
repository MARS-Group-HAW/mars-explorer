import * as React from "react";
import useEntitiesForm from "./use-entities-form.hook";
import MappingsForm from "../mappings-form";
import AgentsEntitiesForm from "../agents-entities-form";

const EntitiesForm = () => {
  const { namespace } = useEntitiesForm();

  return (
    <MappingsForm>
      <AgentsEntitiesForm namespace={namespace} />
    </MappingsForm>
  );
};

export default EntitiesForm;
