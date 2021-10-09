import * as React from "react";
import { Button } from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";
import TrainIcon from "@material-ui/icons/Train";
import HelpIcon from "@material-ui/icons/Help";
import SimObjects from "@shared/types/sim-objects";

type SimTypeSubset = Extract<SimObjects, SimObjects.AGENT | SimObjects.ENTITY>;

type Props = {
  selected?: boolean;
  object: SimTypeSubset;
  onClick: () => void;
};

function objectToIcon(object: SimTypeSubset) {
  switch (object) {
    case SimObjects.AGENT:
      return <GroupIcon />;
    case SimObjects.ENTITY:
      return <TrainIcon />;
    default:
      return <HelpIcon />;
  }
}

function objectToLabel(object: SimTypeSubset) {
  switch (object) {
    case SimObjects.AGENT:
      return "Agent";
    case SimObjects.ENTITY:
      return "Entity";
    default:
      return "Unknown";
  }
}

function ObjectButton({ selected = false, object, onClick }: Props) {
  return (
    <Button
      color="primary"
      size="large"
      variant={selected ? "contained" : "outlined"}
      startIcon={objectToIcon(object)}
      onClick={onClick}
    >
      {objectToLabel(object)}
    </Button>
  );
}

export default ObjectButton;
