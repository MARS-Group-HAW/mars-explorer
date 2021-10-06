import * as React from "react";
import {
  Chip,
  ChipProps,
  CircularProgress,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import HelpIcon from "@material-ui/icons/Help";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import ValidationState from "../../../../utils/types/validation-state";

type Props = {
  label: string;
  status: ValidationState;
  errors?: string[];
};

const useStyles = makeStyles((theme) => ({
  invalid: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
  },
  valid: {
    color: theme.palette.success.contrastText,
    backgroundColor: theme.palette.success.main,
  },
  dirty: {
    color: theme.palette.warning.contrastText,
    backgroundColor: theme.palette.warning.main,
  },
}));

function StatusChip({ label, status, errors }: Props) {
  const theme = useTheme();
  const classes = useStyles();

  const classNameByStatus = () => {
    switch (status) {
      case ValidationState.VALID:
        return classes.valid;
      case ValidationState.INVALID:
        return classes.invalid;
      case ValidationState.DIRTY:
        return classes.dirty;
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
      case ValidationState.DIRTY:
        return "outlined";
      case ValidationState.UNKNOWN:
      case ValidationState.LOADING:
      default:
        return "default";
    }
  };

  const iconByStatus = (valStatus: ValidationState) => {
    switch (valStatus) {
      case ValidationState.VALID:
        return (
          <DoneIcon style={{ color: theme.palette.success.contrastText }} />
        );
      case ValidationState.INVALID:
        return (
          <ErrorIcon style={{ color: theme.palette.error.contrastText }} />
        );
      case ValidationState.DIRTY:
        return (
          <EditIcon style={{ color: theme.palette.warning.contrastText }} />
        );
      case ValidationState.LOADING:
        return <CircularProgress size={18} />;
      case ValidationState.UNKNOWN:
      default:
        return <HelpIcon />;
    }
  };

  const chip = (
    <Chip
      style={{ height: 30 }}
      className={classNameByStatus()}
      variant={variantByState()}
      label={label}
      icon={iconByStatus(status)}
    />
  );

  if (status !== ValidationState.INVALID && status !== ValidationState.DIRTY)
    return chip;

  const ErrorComponent = (
    <>
      <Typography>The following file(s) contain(s) error(s):</Typography>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </>
  );

  const DirtyComponent = (
    <Typography variant="caption">You have unsaved changes.</Typography>
  );

  const getTextByStatus = (state: ValidationState) => {
    switch (state) {
      case ValidationState.INVALID:
        return ErrorComponent;
      case ValidationState.DIRTY:
        return DirtyComponent;
      default:
        return <></>;
    }
  };

  return (
    <Tooltip arrow title={getTextByStatus(status)} placement="top">
      {chip}
    </Tooltip>
  );
}

export default StatusChip;
