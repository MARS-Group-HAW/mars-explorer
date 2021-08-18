import * as React from "react";
import { Button, ButtonProps } from "@material-ui/core";

type Props = ButtonProps & {
  icon: React.ReactNode;
};

function ActionButton({ children, icon, ...props }: Props) {
  return (
    <Button
      variant="contained"
      size="small"
      color="default"
      endIcon={icon}
      {...props}
    >
      {children}
    </Button>
  );
}

export default ActionButton;
