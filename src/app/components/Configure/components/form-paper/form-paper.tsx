import { Paper, styled } from "@material-ui/core";

export default styled(Paper)((props) => ({
  padding: props.theme.spacing(2),
  flexGrow: 1,
  height: "100%",
}));
