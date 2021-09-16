import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import useConfigPath from "./use-config-path";
import FormTransformer from "../../../../Configure/utils/transform";
import defaultValues from "../../../../Configure/utils/defaultValues";

function useConfigSetup() {
  useConfigPath();

  const configPath = ""; // TODO: get from store

  const createNewConfig = async () => {
    window.api.logger.info(
      `Existing config could not be loaded. Creating a new one.`
    );

    const defaultConfig = FormTransformer.formToConfig(defaultValues);

    window.api.logger.info(`Creating default config in ${configPath}.`);

    await window.api.invoke<{ path: string; content: string }, void>(
      Channel.WRITE_CONTENT_TO_FILE,
      { path: configPath, content: defaultConfig }
    );
  };

  const getExistingConfig = async () => {
    const config = await window.api.invoke<string, unknown>(
      Channel.GET_CONFIG_IN_PROJECT,
      configPath
    );

    return FormTransformer.configToForm(config);
  };

  useAsync(async () => {
    const configExists = await window.api.invoke<string, boolean>(
      Channel.CONFIG_EXISTS,
      configPath
    );

    if (configExists) {
      window.api.logger.info("Should create new config");
      // await createNewConfig();
    } else {
      window.api.logger.info("Should use existing config");
      // await getExistingConfig();
    }
  }, [configPath]);
}

export default useConfigSetup;
