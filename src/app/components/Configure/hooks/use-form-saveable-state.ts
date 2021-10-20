import { useMemo } from "react";
import { useFormikContext } from "formik";

function useFormSaveableState(): boolean {
  const { errors } = useFormikContext();

  return useMemo(() => Object.keys(errors).length === 0, [errors]);
}

export default useFormSaveableState;
