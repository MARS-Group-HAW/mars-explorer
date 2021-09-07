import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import FormTransformer from "@app/components/Configure/utils/transform";

function useExistingConfig(path: string) {
  const {
    value: existingConfig,
    loading: configSearchLoading,
    error: configSearchError,
  } = useAsync(async () => {
    if (!path) return null;

    const config = await window.api.invoke<string, unknown>(
      Channel.GET_CONFIG_IN_PROJECT,
      path
    );

    return FormTransformer.configToForm(config);
  }, [path]);
  return { existingConfig, configSearchLoading, configSearchError };
}

export default useExistingConfig;
