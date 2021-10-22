import * as React from "react";
import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import useFormFileInput from "./form-file-input.hook";

const ErrorTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}))(Tooltip);

type Props = {
  namespace: string;
  label?: string;
};

const FormFileInput = ({ namespace, label }: Props) => {
  const { value, handleFileInput, handleBlur, handleClearClick, error } =
    useFormFileInput(namespace);

  const hasError = Boolean(error);

  return (
    <Grid
      container
      justifyContent="space-around"
      alignItems="center"
      wrap="nowrap"
    >
      <ErrorTooltip open={hasError} title={error || ""}>
        <TextField
          id={namespace}
          size="small"
          name={namespace}
          variant="outlined"
          label={label || null}
          error={hasError}
          value={value || ""}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClearClick}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </ErrorTooltip>
      <IconButton color="primary" component="label">
        <AttachFileIcon />
        <input
          type="file"
          hidden
          onChange={handleFileInput}
          onBlur={handleBlur}
          accept="text/csv, application/geo+json, application/zip"
        />
      </IconButton>
    </Grid>
  );
};

export default FormFileInput;
