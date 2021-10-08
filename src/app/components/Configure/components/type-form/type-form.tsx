import * as React from "react";
import AgentsForm from "@app/components/Configure/components/agents-form";
import { AppBar, Divider, Grid, Tab, Tabs } from "@material-ui/core";
import FormPaper from "../form-paper";
import useTypeForm, { TabIndizes } from "./use-type-form.hook";
import useStyles from "./type-form-styles";
import TypeList from "../type-list";
import { SharedMappingsProvider } from "../../hooks/use-shared-mappings";
import useNodeHeight from "../../../../utils/hooks/use-node-height";
import LayersForm from "../layers-form";

const TypeForm = () => {
  const classes = useStyles();
  const { tab, handleTabChange, tabs } = useTypeForm();

  const { ref, height } = useNodeHeight();

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
          <Grid
            ref={ref}
            container
            justifyContent="space-between"
            spacing={2}
            style={{ height: "100%" }}
          >
            <Grid style={{ height }} item xs={2}>
              <TypeList />
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={9}>
              {tab === TabIndizes.AGENTS && <AgentsForm />}
              {tab === TabIndizes.LAYERS && <LayersForm />}
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

export default TypeForm;
