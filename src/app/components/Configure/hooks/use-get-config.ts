import { useEffect } from "react";
import useExistingConfig from "@app/components/Configure/hooks/use-existing-config";
import useNewConfig from "@app/components/Configure/hooks/use-new-config";

type State = {
  config: any | null;
  loading: boolean;
  error?: Error;
  wasCreated: boolean;
};

function useGetConfig(path?: string): State {
  useEffect(
    () =>
      window.api.logger.info(
        `Looking for config in path: ${path || "not defined"}`
      ),
    [path]
  );

  // find existing config
  const { existingConfig, configSearchLoading, configSearchError } =
    useExistingConfig(path);
  const { newConfig, configCreationLoading, configCreationError } =
    useNewConfig(path, Boolean(!path || configSearchLoading || existingConfig));

  return {
    config: existingConfig || newConfig,
    loading: configSearchLoading || configCreationLoading,
    error: configSearchError || configCreationError,
    wasCreated: Boolean(newConfig),
  };
}

export default useGetConfig;
