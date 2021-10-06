import * as React from "react";
import { Fab } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { useFormikContext } from "formik";

function SubmitButton() {
  const { errors, submitForm } = useFormikContext();

  return (
    <Fab
      style={{
        position: "absolute",
        bottom: 60,
        right: 10,
      }}
      disabled={Object.keys(errors).length > 0}
      color="secondary"
      aria-label="save"
      type="submit"
      onClick={submitForm}
    >
      <SaveIcon />
    </Fab>
  );
}

export default SubmitButton;
