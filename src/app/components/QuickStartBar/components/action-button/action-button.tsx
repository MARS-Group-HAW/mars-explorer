import * as React from "react";
import { Button, ButtonProps, CircularProgress } from "@material-ui/core";

type Props = ButtonProps & {
  isLoading?: boolean;
  icon: React.ReactNode;
};

function ActionButton({ children, isLoading, icon, ...props }: Props) {
  return (
    <Button
      variant="contained"
      size="small"
      color="default"
      endIcon={!isLoading && icon}
      {...props}
    >
      {children}
      {isLoading && <CircularProgress size={14} />}
    </Button>
  );
}

export default ActionButton;
