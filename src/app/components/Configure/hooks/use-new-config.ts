import { useAsync } from "react-use";
import FormTransformer from "@app/components/Configure/utils/transform";
import defaultValues from "@app/components/Configure/utils/defaultValues";
import { Channel } from "@shared/types/Channel";

function useNewConfig(path: string, existingConfigFound: boolean) {
  const {
    value: newConfig,
    loading: configCreationLoading,
    error: configCreationError,
  } = useAsync(async () => {
    // TODO

    if (existingConfigFound) return null;

    window.api.logger.info(
      `Existing config could not be loaded. Creating a new one.`
    );

    const defaultConfig = FormTransformer.formToConfig(defaultValues);

    window.api.logger.info(`Creating ${defaultConfig} in ${path}`);

    await window.api.invoke<{ path: string; content: string }, void>(
      Channel.WRITE_CONTENT_TO_FILE,
      { path, content: JSON.stringify(defaultConfig, null, "\t") }
    );

    return defaultConfig;
  }, [existingConfigFound]);

  return { newConfig, configCreationLoading, configCreationError };
}

export default useNewConfig;
