import * as React from "react";
import FormInput from "../form-input";
import { FormInputProps } from "../form-input/form-input";

type Props = Omit<FormInputProps, "type">;

const FormDatepicker = (props: Props) => (
  <FormInput
    type="datetime-local"
    InputLabelProps={{ shrink: true }}
    {...props}
  />
);

export default FormDatepicker;
