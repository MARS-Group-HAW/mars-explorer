import * as React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import useObjectList from "./object-list.hook";

let agentKey = 1;

const ObjectList = () => {
  const { objectNames, selectedIndex, setSelectedIndex } = useObjectList();

  return (
    <List>
      {objectNames.map((name, index) => (
        <ListItem
          key={agentKey++}
          button
          selected={selectedIndex === index}
          onClick={() => setSelectedIndex(index)}
        >
          <ListItemText primary={name} />
        </ListItem>
      ))}
      <ListItem button onClick={console.log}>
        <ListItemText primary="Add" />
      </ListItem>
    </List>
  );
};

export default ObjectList;
