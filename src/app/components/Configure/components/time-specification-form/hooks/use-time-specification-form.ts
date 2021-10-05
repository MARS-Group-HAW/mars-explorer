import { useField } from "formik";
import { useEffect } from "react";
import { FormSwitchOption } from "../../form-switch/types";
import { TimeSpecification } from "../../globals-form/utils/types";
import withNamespace from "../../../utils/withNamespace";
import useStepForm from "./use-step-form";
import useDatePointsForm from "./use-date-points-form";
import FieldNames from "../../globals-form/utils/fieldNames";

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

function useTimeSpecificationForm(namespace: string): State {
  const timeSpecNamespace = withNamespace(
    FieldNames.TIME_SPECIFICATION,
    namespace
  );
  const [timeSpecField] = useField(timeSpecNamespace);

  const isStepBased = timeSpecField.value === TimeSpecification.STEP;

  const {
    namespace: stepsNamespace,
    min: stepsMin,
    disabled: stepsDisabled,
    handleReset: stepsHandleReset,
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
      stepsHandleReset();
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
