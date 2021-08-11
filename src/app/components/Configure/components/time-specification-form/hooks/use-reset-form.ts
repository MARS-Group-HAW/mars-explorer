import { FieldHelperProps } from "formik";

type State = {
  handleReset: () => void;
};

function useResetForm<T>(helper: FieldHelperProps<T>, defaultValue: T): State {
  const handleReset = () => {
    helper.setValue(defaultValue, false);
    helper.setTouched(false);
  };

  return {
    handleReset,
  };
}

export default useResetForm;
