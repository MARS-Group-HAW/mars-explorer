import * as React from "react";
import { Button } from "@material-ui/core";
import GroupIcon from "@material-ui/icons/Group";
import GridOnIcon from "@material-ui/icons/GridOn";
import TrainIcon from "@material-ui/icons/Train";
import HelpIcon from "@material-ui/icons/Help";
import SimObjects from "@shared/types/sim-objects";

type Props = {
  selected?: boolean;
  object: SimObjects;
  onClick: () => void;
};

function objectToIcon(object: SimObjects) {
  switch (object) {
    case SimObjects.AGENT:
      return <GroupIcon />;
    case SimObjects.LAYER:
      return <GridOnIcon />;
    case SimObjects.ENTITY:
      return <TrainIcon />;
    default:
      return <HelpIcon />;
  }
}

function objectToLabel(object: SimObjects) {
  switch (object) {
    case SimObjects.AGENT:
      return "Agent";
    case SimObjects.LAYER:
      return "Layer";
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
