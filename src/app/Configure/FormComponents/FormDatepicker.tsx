import * as React from "react";
import FormInput, { FormInputProps } from "./FormInput";

type Props = Omit<FormInputProps, "type">;

const FormDatepicker = (props: Props) => (
  <FormInput
    type="datetime-local"
    InputLabelProps={{ shrink: true }}
    {...props}
  />
);

export default FormDatepicker;
