import * as React from "react";
import {
  Chip,
  ChipProps,
  CircularProgress,
  Tooltip,
  Typography,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import HelpIcon from "@material-ui/icons/Help";
import { makeStyles } from "@material-ui/core/styles";
import ValidationState from "../../../../utils/types/validation-state";

type Props = {
  label: string;
  status: ValidationState;
  errors?: string[];
};

const useStyles = makeStyles(() => ({
  invalid: {
    color: "white",
    backgroundColor: "red",
  },
  valid: {
    color: "white",
    backgroundColor: "green",
  },
}));

const getIconByStatus = (status: ValidationState) => {
  const style = { color: "white" };

  switch (status) {
    case ValidationState.VALID:
      return <DoneIcon style={style} />;
    case ValidationState.INVALID:
      return <ErrorIcon style={style} />;
    case ValidationState.LOADING:
      return <CircularProgress size={18} />;
    case ValidationState.UNKNOWN:
    default:
      return <HelpIcon />;
  }
};

function StatusChip({ label, status, errors }: Props) {
  const classes = useStyles();

  const classNameByStatus = () => {
    switch (status) {
      case ValidationState.VALID:
        return classes.valid;
      case ValidationState.INVALID:
        return classes.invalid;
      case ValidationState.UNKNOWN:
      case ValidationState.LOADING:
      default:
        return "";
    }
  };

  const variantByState = (): ChipProps["variant"] => {
    switch (status) {
      case ValidationState.VALID:
      case ValidationState.INVALID:
        return "outlined";
      case ValidationState.UNKNOWN:
      case ValidationState.LOADING:
      default:
        return "default";
    }
  };

  const chip = (
    <Chip
      style={{ height: 30 }}
      className={classNameByStatus()}
      variant={variantByState()}
      label={label}
      icon={getIconByStatus(status)}
    />
  );

  if (!errors) return chip;

  return (
    <Tooltip
      arrow
      title={
        <>
          <Typography>The following file(s) contain(s) error(s):</Typography>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </>
      }
      placement="top"
    >
      {chip}
    </Tooltip>
  );
}

export default StatusChip;
