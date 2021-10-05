import { FieldInputProps } from "formik";
import { useEffect } from "react";
import useNamespacedField from "@app/components/Configure/hooks/use-namespaced-field";
import FieldNames from "./utils/fieldNames";
import defaultValues from "./utils/defaultValues";
import noneDefaultValues from "../output-none-form/utils/defaultValues";
import csvDefaultValues from "../output-csv-form/utils/defaultValues";
import sqlightDefaultValues from "../output-sqlite-form/utils/defaultValues";
import { OutputSpecification } from "./utils/types";

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
    if (!value) return;

    switch (value) {
      case OutputSpecification.CSV:
        setValue(csvDefaultValues);
        break;
      case OutputSpecification.SQLITE:
        setValue(sqlightDefaultValues);
        break;
      case OutputSpecification.NONE:
        setValue(noneDefaultValues);
        break;
      default:
        window.api.logger.warn(
          "An unknown output specification was provided to the output form: ",
          value
        );
        setValue(defaultValues);
        break;
    }
  }, [value]);

  return {
    outputNamespace,
    optionsNamespace,
    value: OutputSpecification.CSV,
    handleChange: onChange,
    choices: CHOICES,
  };
}

export default useOutputsForm;
