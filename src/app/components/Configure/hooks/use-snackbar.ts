import { useBoolean, useTimeoutFn } from "react-use";
import { useEffect } from "react";

type State = {
  showSnackbar: boolean;
};

function useSnackbar(loading: boolean, timeout: number = 3000): State {
  const [showSnackbar, setShowSnackbar] = useBoolean(false);

  const [, cancel, reset] = useTimeoutFn(() => setShowSnackbar(false), timeout);

  useEffect(() => {
    cancel();
    setShowSnackbar(false);

    if (loading) return;

    setShowSnackbar(true);
    reset();
  }, [loading]);

  return { showSnackbar };
}

export default useSnackbar;
