import { useField } from "formik";
import withNamespace from "../../../utils/withNamespace";
import FieldNames from "../../globals-form/utils/fieldNames";
import defaultValues from "../../globals-form/utils/defaultValues";
import useResetForm from "./use-reset-form";

type State = {
  namespace: string;
  min: 1;
  disabled: boolean;
  handleReset: () => void;
};

function useStepForm(namespace: string, isStepBased: boolean): State {
  const stepsNamespace = withNamespace(FieldNames.STEPS, namespace);
  const [, , stepsHelpers] = useField(stepsNamespace);
  const { handleReset } = useResetForm(
    stepsHelpers,
    defaultValues[FieldNames.STEPS]
  );

  return {
    namespace: stepsNamespace,
    min: 1,
    disabled: !isStepBased,
    handleReset,
  };
}

export default useStepForm;
