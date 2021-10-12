import * as React from "react";
import { useCallback } from "react";
import { Fab } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { useFormikContext } from "formik";
import useSaveKey from "../../../../utils/hooks/use-save-key";

function SubmitButton() {
  const { errors, submitForm } = useFormikContext();

  const canBeSaved = useCallback(
    () => Object.keys(errors).length === 0,
    [errors]
  );

  useSaveKey(canBeSaved, submitForm);

  return (
    <Fab
      style={{
        position: "absolute",
        bottom: 60,
        right: 10,
      }}
      disabled={!canBeSaved()}
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
