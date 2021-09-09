import * as React from "react";
import { Chip } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import HelpIcon from "@material-ui/icons/Help";
import ValidationState from "../../../../util/types/validation-state";

type Props = {
  label: string;
  status: ValidationState;
};

const getIconByStatus = (status: ValidationState) => {
  switch (status) {
    case ValidationState.VALID:
      return <DoneIcon />;
    case ValidationState.INVALID:
      return <ErrorIcon />;
    case ValidationState.UNKNOWN:
      return <HelpIcon />;
    default:
      return <HelpIcon />;
  }
};

function StatusChip({ label, status }: Props) {
  return <Chip label={label} icon={getIconByStatus(status)} />;
}

export default StatusChip;
