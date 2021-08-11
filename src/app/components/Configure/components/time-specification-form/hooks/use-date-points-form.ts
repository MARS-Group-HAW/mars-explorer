import { useField } from "formik";
import withNamespace from "../../../utils/withNamespace";
import FieldNames from "../../globals-form/utils/fieldNames";
import defaultValues from "../../globals-form/utils/defaultValues";
import useResetForm from "./use-reset-form";

type State = {
  startPointNamespace: string;
  startPointMax: string;
  startPointDisabled: boolean;
  endPointNamespace: string;
  endPointMin: string;
  endPointDisabled: boolean;
  handleReset: () => void;
};

function useDatePointsForm(namespace: string, isStepBased: boolean): State {
  const startPointNamespace = withNamespace(FieldNames.START_POINT, namespace);
  const endPointNamespace = withNamespace(FieldNames.END_POINT, namespace);

  const [startPointField, , startPointHelpers] = useField(startPointNamespace);
  const [endPointField, , endPointHelpers] = useField(endPointNamespace);

  const { handleReset: startPointHandleReset } = useResetForm(
    startPointHelpers,
    defaultValues[FieldNames.START_POINT]
  );
  const { handleReset: endPointHandleReset } = useResetForm(
    endPointHelpers,
    defaultValues[FieldNames.END_POINT]
  );

  const handleReset = () => {
    startPointHandleReset();
    endPointHandleReset();
  };

  return {
    startPointNamespace,
    endPointNamespace,
    startPointMax: endPointField.value,
    startPointDisabled: isStepBased,
    endPointMin: startPointField.value,
    endPointDisabled: isStepBased || !startPointField.value,
    handleReset,
  };
}

export default useDatePointsForm;
