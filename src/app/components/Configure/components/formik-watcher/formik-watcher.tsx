import * as React from "react";
import { useEffect } from "react";
import { useFormikContext } from "formik";
import { useUnmount } from "react-use";
import { useAppDispatch } from "../../../../utils/hooks/use-store";
import {
  setDirtyState,
  setInvalidState,
  setValidState,
} from "../../utils/config-slice";

// hacky because we cannot know the depth of the object
const isAnyFieldTouched = (obj: any) => JSON.stringify(obj).match(/:true/);

function FormikWatcher() {
  const dispatch = useAppDispatch();

  const { touched, validateForm } = useFormikContext();

  useEffect(() => {
    const hasBeenTouched = isAnyFieldTouched(touched);

    if (hasBeenTouched) {
      dispatch(setDirtyState());
    }
  }, [touched]);

  useUnmount(() => {
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      dispatch(setValidState());
    } else {
      dispatch(setInvalidState());
    }
  });

  return <></>;
}

export default FormikWatcher;
