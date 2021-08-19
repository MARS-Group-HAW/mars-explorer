import { FieldInputProps, useField } from "formik";
import { useEffect } from "react";
import OutputSpecification from "./utils/types";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "./utils/fieldNames";
import outputDefaultValues from "./utils/defaultValues";
import csvDefaultValues from "../output-csv-form/utils/defaultValues";
import sqlightDefaultValues from "../output-sqlite-form/utils/defaultValues";

type State = {
  name: string;
  optionsNamespace: string;
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
  const name = withNamespace(FieldNames.OUTPUT, namespace);
  const optionsNamespace = withNamespace(FieldNames.OPTIONS, namespace);
  const [{ value, onChange }] = useField(name);
  const [, , { setValue }] = useField(optionsNamespace);

  useEffect(() => {
    switch (value) {
      case OutputSpecification.CSV:
        setValue(csvDefaultValues);
        break;
      case OutputSpecification.SQLITE:
        setValue(sqlightDefaultValues);
        break;
      default:
        setValue(outputDefaultValues[FieldNames.OPTIONS]);
        break;
    }
  }, [value]);

  return {
    name,
    optionsNamespace,
    value,
    handleChange: onChange,
    choices: CHOICES,
  };
}

export default useOutputsForm;
