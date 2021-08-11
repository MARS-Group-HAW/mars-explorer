import * as React from "react";
import FormBox from "../form-box";

type Props = {
  namespace: string;
};

function OutputsCsvForm({ namespace }: Props) {
  return <FormBox>CSV FORM in {namespace}</FormBox>;
}

export default OutputsCsvForm;
