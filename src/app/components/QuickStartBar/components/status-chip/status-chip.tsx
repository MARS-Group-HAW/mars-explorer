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
  list?: string[];
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

function StatusChip({ label, status, list }: Props) {
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

  const isDirty = status === ValidationState.DIRTY;

  const TooltipContent = (
    <>
      <Typography variant="caption">
        {isDirty ? "Unsaved changes in:" : "Errors in:"}
      </Typography>
      <ul style={{ paddingLeft: 20 }}>
        {list.map((item) => (
          <li key={item}>
            <Typography variant="body1">{item}</Typography>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <Tooltip arrow title={TooltipContent} placement="top">
      {chip}
    </Tooltip>
  );
}

export default StatusChip;
