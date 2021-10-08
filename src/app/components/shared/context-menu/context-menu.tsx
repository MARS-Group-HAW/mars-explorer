import * as React from "react";
import { MutableRefObject, ReactNode } from "react";
import { Menu } from "@material-ui/core";
import useContextMenu from "../../../utils/hooks/use-context-menu";

type Props = {
  anchorRef: MutableRefObject<HTMLDivElement>;
  children: ReactNode;
};

function ContextMenu({ anchorRef, children }: Props) {
  const { isMenuOpen, closeMenu } = useContextMenu(anchorRef);

  return (
    <Menu anchorEl={anchorRef.current} open={isMenuOpen} onClose={closeMenu}>
      {children}
    </Menu>
  );
}

export default ContextMenu;
