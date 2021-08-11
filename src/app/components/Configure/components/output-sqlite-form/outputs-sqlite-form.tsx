import * as React from "react";
import FormBox from "../form-box";

type Props = {
  namespace: string;
};

function OutputsSqliteForm({ namespace }: Props) {
  return <FormBox>SQLITE FORM in {namespace}</FormBox>;
}

export default OutputsSqliteForm;
