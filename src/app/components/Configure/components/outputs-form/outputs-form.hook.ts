import { FieldInputProps, useField } from "formik";
import OutputSpecification from "./utils/types";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "./utils/fieldNames";

type State = {
  name: string;
  value: OutputSpecification;
  handleChange: FieldInputProps<string>["onChange"];
  choices: {
    label: string;
    value: OutputSpecification;
  }[];
};

const CHOICES = [
  {
    value: OutputSpecification.NONE,
    label: "No extra output",
  },
  {
    value: OutputSpecification.CSV,
    label: "CSV",
  },
  {
    value: OutputSpecification.SQLITE,
    label: "SQLite",
  },
];

function useOutputsForm(namespace: string): State {
  const name = withNamespace(FieldNames.OUTPUT_SPECIFICATION, namespace);
  const [{ value, onChange }] = useField(name);

  return {
    name,
    value,
    handleChange: onChange,
    choices: CHOICES,
  };
}

export default useOutputsForm;
