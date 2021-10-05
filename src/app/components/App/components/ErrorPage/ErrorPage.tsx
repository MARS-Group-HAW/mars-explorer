import * as React from "react";
import { Box, Button, Paper, Typography } from "@material-ui/core";
import { Channel } from "@shared/types/Channel";
import { FallbackProps } from "react-error-boundary";

type Props = FallbackProps;

const restart = () => window.api.send(Channel.RESTART_APP);

function ErrorPage({ error }: Props) {
  if (error) {
    window.api.logger.error("Something went wrong: ", error);
  }

  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      component={Paper}
    >
      <Typography>Sorry, something went wrong!</Typography>
      <Typography variant="h5" color="error">
        {error.name}
      </Typography>
      <Typography variant="h6" color="error">
        {error.message}
      </Typography>
      <Typography
        style={{ width: "60%" }}
        variant="caption"
        color="textSecondary"
      >
        {error.stack}
      </Typography>
      <Button variant="contained" onClick={restart}>
        Restart
      </Button>
    </Box>
  );
}

export default ErrorPage;
