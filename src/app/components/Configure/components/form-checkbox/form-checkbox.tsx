import * as React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import useFormCheckbox from "./form-checkbox.hook";
import { WithNamespace } from "../../utils/namespaces";

const FormCheckbox = ({ name }: WithNamespace) => {
  const { checked, label, handleBlur, handleChange } = useFormCheckbox(name);

  return (
    <FormControlLabel
      control={
        <Checkbox
          id={name}
          name={name}
          checked={Boolean(checked)}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      }
      label={label}
    />
  );
};

export default FormCheckbox;
