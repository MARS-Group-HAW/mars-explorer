import * as React from "react";
import { useCallback } from "react";
import { Dialog, DialogProps } from "@material-ui/core";
import { useKey } from "react-use";

type Props = DialogProps & {
  key?: string;
  onKeyPressed: () => void;
  disabled?: boolean;
};

function DialogWithKeyListener({
  open,
  children,
  key = "Enter",
  onKeyPressed,
  disabled = false,
  ...rest
}: Props) {
  const hasBeenPressed = useCallback(
    (evt: KeyboardEvent) => open && !disabled && evt.key === key,
    [key, open, disabled]
  );

  useKey(hasBeenPressed, onKeyPressed, {}, [onKeyPressed]);

  return (
    <Dialog open={open} {...rest}>
      {children}
    </Dialog>
  );
}

export default DialogWithKeyListener;
