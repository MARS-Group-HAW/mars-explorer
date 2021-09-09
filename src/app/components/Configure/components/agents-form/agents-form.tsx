import * as React from "react";
import { Divider, Grid } from "@material-ui/core";
import { FieldArray } from "formik";
import useAgentsForm from "./use-agents-form.hook";
import MappingsForm from "../mappings-form";
import ObjectList from "../object-list";
import defaultValues from "./utils/defaultValues";

const AgentsForm = ({ namespace }: { namespace: string }) => {
  const {
    agentNames,
    selectedAgentNameIndex,
    selectedAgentNamespace,
    handleAgentNameSelect,
  } = useAgentsForm(namespace);

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <FieldArray
          name={namespace}
          render={(arrayHelpers) => (
            <ObjectList
              objectNames={agentNames}
              selectedObjectNameIndex={selectedAgentNameIndex}
              handleObjectNameClick={handleAgentNameSelect}
              handleNewObject={() => arrayHelpers.push(defaultValues)}
            />
          )}
        />
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item>
        <MappingsForm namespace={selectedAgentNamespace} />
      </Grid>
    </Grid>
  );
};

export default AgentsForm;
