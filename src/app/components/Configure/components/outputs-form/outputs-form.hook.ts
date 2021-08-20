import { FieldInputProps } from "formik";
import { useEffect } from "react";
import useNamespacedField from "@app/components/Configure/hooks/use-namespaced-field";
import { NonOutput } from "@app/components/Configure/utils/types";
import OutputSpecification from "./utils/types";
import FieldNames from "./utils/fieldNames";
import outputDefaultValues from "./utils/defaultValues";
import csvDefaultValues from "../output-csv-form/utils/defaultValues";
import sqlightDefaultValues from "../output-sqlite-form/utils/defaultValues";

type State = {
  outputNamespace: string;
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
  const [{ value, onChange }, , , outputNamespace] =
    useNamespacedField<OutputSpecification>(FieldNames.OUTPUT, namespace);
  const [, , { setValue }, optionsNamespace] = useNamespacedField(
    FieldNames.OPTIONS,
    namespace
  );

  useEffect(() => {
    switch (value) {
      case OutputSpecification.CSV:
        setValue(csvDefaultValues);
        break;
      case OutputSpecification.SQLITE:
        setValue(sqlightDefaultValues);
        break;
      case OutputSpecification.NONE:
        setValue((outputDefaultValues as NonOutput)[FieldNames.OPTIONS]);
        break;
      default:
        window.api.logger.warn(
          "An unknown output specification was provided to the output form: ",
          value
        );
    }
  }, [value]);

  return {
    outputNamespace,
    optionsNamespace,
    value,
    handleChange: onChange,
    choices: CHOICES,
  };
}

export default useOutputsForm;
