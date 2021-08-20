import { Channel } from "@shared/types/Channel";
import { useAsync } from "react-use";
import defaultValues from "@app/components/Configure/utils/defaultValues";
import FormTransformer from "@app/components/Configure/utils/transform";

type State = {
  config: any | null;
  loading: boolean;
  error: Error;
};

function useGetConfig(path?: string): State {
  const { value, loading, error } = useAsync(
    async () =>
      path
        ? window.api.invoke<string, unknown>(
            Channel.GET_CONFIG_IN_PROJECT,
            path
          )
        : null,
    [path]
  );

  useAsync(async () => {
    if (value && !loading && !error) return value;

    const defaultValuesAsString = JSON.stringify(
      FormTransformer.formToConfig(defaultValues),
      null,
      4
    );

    // TODO: add to main
    await window.api.invoke<{ path: string; content: string }, unknown>(
      Channel.CREATE_DEFAULT_CONFIG,
      { path, content: defaultValuesAsString }
    );

    return JSON.parse(defaultValuesAsString);
  }, [value]);

  console.log(value, loading, error);

  return {
    config: value,
    loading,
    error,
  };
}

export default useGetConfig;
