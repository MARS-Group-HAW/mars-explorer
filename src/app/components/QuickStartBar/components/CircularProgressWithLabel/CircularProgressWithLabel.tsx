import React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

type Props = CircularProgressProps & {
  hasStarted: boolean;
  value: number;
};

function CircularProgressWithLabel({ value, hasStarted, ...props }: Props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        color="secondary"
        variant={hasStarted ? "determinate" : "indeterminate"}
        value={value}
        {...props}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div">
          {hasStarted ? `${value}%` : "..."}
        </Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressWithLabel;
