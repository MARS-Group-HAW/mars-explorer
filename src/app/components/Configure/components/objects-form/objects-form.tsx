import * as React from "react";
import AgentsForm from "@app/components/Configure/components/agents-form";
import useObjectsForm from "@app/components/Configure/components/objects-form/use-objects-form.hook";

type Props = {
  namespaceAgents: string;
  // namespaceLayers: string;
};

// eslint-disable-next-line react/require-default-props
const ObjectsForm = ({ namespaceAgents }: Props) => {
  const { agents } = useObjectsForm(namespaceAgents);

  return (
    <div>
      {agents}
      <AgentsForm namespace={namespaceAgents} />
    </div>
  );
};

export default ObjectsForm;
