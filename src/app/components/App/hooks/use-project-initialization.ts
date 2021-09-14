import { Channel } from "@shared/types/Channel";
import { useBoolean, useEffectOnce } from "react-use";
import { useEffect } from "react";

type State = {
  isLoading: boolean;
};

function useProjectInitialization(path?: string): State {
  const [initialized, setInitialized] = useBoolean(false);

  useEffectOnce(() =>
    window.api.on(Channel.PROJECT_INITIALIZED, () => setInitialized(true))
  );

  useEffect(() => setInitialized(false), [path]);

  return {
    isLoading: !initialized,
  };
}

export default useProjectInitialization;
