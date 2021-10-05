import { useField } from "formik";
import { useEffect, useState } from "react";
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
  handleEnable: () => void;
};

function useDatePointsForm(namespace: string, isStepBased: boolean): State {
  const startPointNamespace = withNamespace(FieldNames.START_POINT, namespace);
  const endPointNamespace = withNamespace(FieldNames.END_POINT, namespace);

  const [startPointField, , startPointHelpers] = useField(startPointNamespace);
  const [endPointField, , endPointHelpers] = useField(endPointNamespace);

  const [prevStartPoint, setPrevStartPoint] = useState(startPointField.value);
  const [prevEndPoint, setPrevEndPoint] = useState(endPointField.value);

  useEffect(() => {
    if (startPointField.value) setPrevStartPoint(startPointField.value);
    if (endPointField.value) setPrevEndPoint(endPointField.value);
  }, [startPointField, endPointField]);

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

  const handleEnable = () => {
    if (prevStartPoint) startPointHelpers.setValue(prevStartPoint);
    if (prevEndPoint) endPointHelpers.setValue(prevEndPoint);
  };

  return {
    startPointNamespace,
    endPointNamespace,
    startPointMax: endPointField.value,
    startPointDisabled: isStepBased,
    endPointMin: startPointField.value,
    endPointDisabled: isStepBased || !startPointField.value,
    handleReset,
    handleEnable,
  };
}

export default useDatePointsForm;
