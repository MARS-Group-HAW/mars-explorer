import { useField } from "formik";
import { useEffect } from "react";
import { useBoolean } from "react-use";
import { FormSwitchOption } from "../../form-switch/types";
import { TimeSpecification } from "../../globals-form/utils/types";
import withNamespace from "../../../utils/withNamespace";
import useStepForm from "./use-step-form";
import useDatePointsForm from "./use-date-points-form";
import FieldNames from "../../../utils/fieldNames";
import GlobalFieldNames from "../../globals-form/utils/fieldNames";

type State = {
  timeSpecNamespace: string;
  stepsNamespace: string;
  startPointNamespace: string;
  endPointNamespace: string;
  optionRight: FormSwitchOption;
  optionLeft: FormSwitchOption;
  stepsMin: number;
  stepsDisabled: boolean;
  startPointMax: string | null;
  startPointDisabled: boolean;
  endPointMin: string | null;
  endPointDisabled: boolean;
};

const namespace = FieldNames.GLOBALS;

function useTimeSpecificationForm(): State {
  const timeSpecNamespace = withNamespace(
    GlobalFieldNames.TIME_SPECIFICATION,
    namespace
  );

  const [timeSpecField] = useField(timeSpecNamespace);

  const val = timeSpecField.value;

  const [isStepBased, setStepBased] = useBoolean(true);

  useEffect(() => {
    if (val === undefined) return;

    setStepBased(val === TimeSpecification.STEP);
  }, [val]);

  const {
    namespace: stepsNamespace,
    min: stepsMin,
    disabled: stepsDisabled,
  } = useStepForm(namespace, isStepBased);

  const {
    startPointNamespace,
    startPointMax,
    startPointDisabled,
    endPointNamespace,
    endPointMin,
    endPointDisabled,
    handleReset: handleDatePointReset,
    handleEnable,
  } = useDatePointsForm(namespace, isStepBased);

  useEffect(() => {
    if (isStepBased) {
      handleDatePointReset();
    } else {
      handleEnable();
    }
  }, [isStepBased]);

  return {
    timeSpecNamespace,
    stepsNamespace,
    stepsMin,
    stepsDisabled,
    startPointNamespace,
    startPointMax,
    startPointDisabled,
    endPointNamespace,
    endPointMin,
    endPointDisabled,
    optionLeft: {
      value: TimeSpecification.STEP,
      label: "Step",
    },
    optionRight: {
      value: TimeSpecification.DATETIME,
      label: "Date-Time",
    },
  };
}

export default useTimeSpecificationForm;
