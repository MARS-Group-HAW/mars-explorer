import { MenuItem, shell } from "electron";
import appPaths from "./app-paths";

const menuItems: MenuItem[] = [
  new MenuItem({
    label: "Debug",
    submenu: [
      {
        label: "Open Logs",
        click: () => {
          shell.openPath(appPaths.logsDir);
        },
      },
    ],
  }),
];

export default menuItems;
