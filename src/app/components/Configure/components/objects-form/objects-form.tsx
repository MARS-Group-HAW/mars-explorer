import * as React from "react";
import AgentsForm from "@app/components/Configure/components/agents-form";
import { AppBar, Divider, Grid, Tab, Tabs } from "@material-ui/core";
import FormPaper from "../form-paper";
import useObjectsForm, { TabIndizes } from "./use-objects-form.hook";
import useStyles from "./objects-form-styles";
import ObjectList from "../object-list";
import { SharedMappingsProvider } from "../../hooks/use-shared-mappings";

const ObjectsForm = () => {
  const classes = useStyles();
  const { tab, handleTabChange, tabs } = useObjectsForm();

  return (
    <SharedMappingsProvider>
      <div className={classes.grid}>
        <AppBar position="static">
          <Tabs value={tab} onChange={(ev, val) => handleTabChange(val)}>
            {tabs.map((currentTab) => (
              <Tab
                key={currentTab.value}
                value={currentTab.value}
                fullWidth
                label={currentTab.label}
              />
            ))}
          </Tabs>
        </AppBar>
        <FormPaper className={classes.content}>
          <Grid container spacing={2} style={{ height: "100%" }}>
            <Grid item xs={2}>
              <ObjectList />
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item>
              {tab === TabIndizes.AGENTS && <AgentsForm />}
              {tab === TabIndizes.LAYERS && (
                <div>Layers: Not supported yet</div>
              )}
              {tab === TabIndizes.ENTITIES && (
                <div>Entities: Not supported yet</div>
              )}
            </Grid>
          </Grid>
        </FormPaper>
      </div>
    </SharedMappingsProvider>
  );
};

export default ObjectsForm;
