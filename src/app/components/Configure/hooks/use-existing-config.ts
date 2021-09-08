import { useAsync } from "react-use";
import { Channel } from "@shared/types/Channel";
import FormTransformer, {
  FormSchema,
} from "@app/components/Configure/utils/transform";

type State = {
  existingConfig: FormSchema | null;
  configSearchLoading: boolean;
  configSearchError?: Error;
};

function useExistingConfig(path: string): State {
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
