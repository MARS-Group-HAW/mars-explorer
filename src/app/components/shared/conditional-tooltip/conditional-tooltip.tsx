import * as React from "react";
import { ReactElement } from "react";
import { Tooltip, TooltipProps } from "@material-ui/core";

type Props = {
  show: boolean;
  children: ReactElement;
} & TooltipProps;

const ConditionalTooltip = ({ show, children, title, ...rest }: Props) =>
  show ? (
    <Tooltip title={title} {...rest}>
      {children}
    </Tooltip>
  ) : (
    children
  );

export default ConditionalTooltip;
