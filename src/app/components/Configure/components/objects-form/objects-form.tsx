import * as React from "react";
import AgentsForm from "@app/components/Configure/components/agents-form";
import { AppBar, Tab, Tabs } from "@material-ui/core";
// TODO: use icons?
// import LayersIcon from "@material-ui/icons/Layers";
// import AccessibilityIcon from "@material-ui/icons/Accessibility";
import SwipeableViews from "react-swipeable-views";
import FormPaper from "../form-paper";
import useObjectsForm from "./use-objects-form.hook";
import useStyles from "./objects-form-styles";

type Props = {
  namespaceAgents: string;
  // namespaceLayers: string;
};

const ObjectsForm = ({ namespaceAgents }: Props) => {
  const classes = useStyles();
  const { currentTab, handleTabChange, tabs } = useObjectsForm();

  return (
    <div className={classes.grid}>
      <AppBar position="static">
        <Tabs value={currentTab} onChange={(ev, val) => handleTabChange(val)}>
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              fullWidth
              label={tab.label}
            />
          ))}
        </Tabs>
      </AppBar>
      <FormPaper className={classes.content}>
        <SwipeableViews
          index={currentTab}
          onChangeIndex={handleTabChange}
          disableLazyLoading
        >
          <AgentsForm namespace={namespaceAgents} />
          <div>Layers</div>
        </SwipeableViews>
      </FormPaper>
    </div>
  );
};

export default ObjectsForm;
