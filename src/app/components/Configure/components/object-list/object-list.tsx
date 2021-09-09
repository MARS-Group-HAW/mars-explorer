import * as React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";

let agentKey = 1;

type Props = {
  objectNames: string[];
  selectedObjectNameIndex: number;
  handleObjectNameClick: (index: number) => void;
  handleNewObject: () => void;
};

// eslint-disable-next-line react/require-default-props
const ObjectList = ({
  objectNames,
  selectedObjectNameIndex,
  handleObjectNameClick,
  handleNewObject,
}: Props) => (
  <List>
    {objectNames.map((objName, index) => (
      <ListItem
        key={agentKey++}
        button
        selected={selectedObjectNameIndex === index}
        onClick={() => handleObjectNameClick(index)}
      >
        <ListItemText primary={objName} />
      </ListItem>
    ))}
    <ListItem button onClick={handleNewObject}>
      <ListItemText primary="Add" />
    </ListItem>
  </List>
);

export default ObjectList;
