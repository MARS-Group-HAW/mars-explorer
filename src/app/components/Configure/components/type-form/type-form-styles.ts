import { makeStyles } from "@material-ui/core";

const barHeight = 48;

export default makeStyles(() => ({
  grid: {
    height: "100%",
  },
  content: {
    height: `calc(100% - ${barHeight}px)`,
  },
}));
